const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 4000;

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Proxy /webhook/* directly to n8n without rewriting the path
app.use('/webhook', createProxyMiddleware({
  target: 'http://localhost:5678',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(502);
    res.end('Proxy failed');
  }
}));

app.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}/webhook`);
});
