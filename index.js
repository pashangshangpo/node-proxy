const http = require('http')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({
  secure: false,
})

const server = http.createServer(function(req, res) {
  res.oldWriteHead = res.writeHead
  res.writeHead = function(statusCode, headers) {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')

    res.oldWriteHead(statusCode, headers)
  }

  const url = decodeURIComponent(req.url.slice(1))

  req.url = '/'

  proxy.web(req, res, { target: url, changeOrigin: true, })
})

server.listen(9988)
