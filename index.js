const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({
  secure: false,
})

proxy.on('proxyReq', function(proxyReq) {
  proxyReq.setHeader('user-agent', 'chrome')
  proxyReq.setHeader('connection', 'keep-alive')
})

const server = http.createServer({}, function(req, res) {
  res.oldWriteHead = res.writeHead

  res.writeHead = function(statusCode, headers) {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept-Language,Content-Language,Accept,*')

    res.oldWriteHead(statusCode === 302 ? 200 : statusCode, headers)
  }

  const url = decodeURIComponent(req.url.slice(1))

  req.url = '/'

  if (url === '' || !url.includes('http')) {
    res.end('Hi...')

    return
  }

  try {
    proxy.web(req, res, {
      target: url,
      changeOrigin: true,
      timeout: 1000 * 10,
      proxyTimeout: 1000 * 10,
      followRedirects: false,
    }, () => {
      res.end('')
    })
  } catch (err) {
    res.end('Hi...')
  }
})

server.listen(9501, '0.0.0.0', () => {
  console.log('http://localhost:9501')
})
