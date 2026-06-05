const PROXY_TARGET = 'http://localhost:8080';

module.exports = {
  '/api': {
    target: PROXY_TARGET,
    secure: false,
    changeOrigin: true,
    logLevel: 'info',
    onProxyRes(proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    onProxyReq(proxyReq, req, res) {
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.setHeader('Access-Control-Max-Age', '86400');
        res.statusCode = 200;
        res.end();
        return;
      }
    }
  }
};
