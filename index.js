const fs = require('fs')
const https = require('https')
const httpProxy = require('http-proxy')

const options = {
  key: fs.readFileSync('./ssl/web.xxx.ssl.key', 'utf8'),
  cert: fs.readFileSync('./ssl/web.xxx.ssl.pem', 'utf8')
}

const proxy = httpProxy.createProxyServer({
  secure: false,
  ssl: options
})

const server = https.createServer(options, function(req, res) {
  res.oldWriteHead = res.writeHead
  res.writeHead = function(statusCode, headers) {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')

    res.oldWriteHead(statusCode, headers)
  }

  const url = decodeURIComponent(req.url.slice(1))

  req.url = '/'

  if (url === '' || !url.includes('http')) {
    res.end('Hi...')

    return
  }

  proxy.web(req, res, { target: url, changeOrigin: true, })
})

server.listen(9988)
