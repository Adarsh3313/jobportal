'use strict';
// The HTTP server: CORS + security headers, /api routing, and serving the built frontend
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const routes = require('./routes');
const { HttpError, sendJson, sendText } = require('./utils/http');
const { CORS_ORIGINS, FRONTEND_DIST } = require('./config');

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2', '.map': 'application/json' };
function serveStatic(req, res, pathname) {
  if (!fs.existsSync(path.join(FRONTEND_DIST, 'index.html'))) return sendText(res, 404, 'Frontend not built. Run: cd frontend && npm install && npm run build');
  let file = path.normalize(path.join(FRONTEND_DIST, decodeURIComponent(pathname)));
  if (!file.startsWith(FRONTEND_DIST)) return sendText(res, 403, 'Forbidden');
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(FRONTEND_DIST, 'index.html'); // SPA fallback for React Router
  const ext = path.extname(file); const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
  if (file.includes(path.sep + 'assets' + path.sep)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  res.writeHead(200, headers); fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const origin = req.headers.origin;
  if (origin && (CORS_ORIGINS.includes('*') || CORS_ORIGINS.includes(origin) || (!CORS_ORIGINS.length && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)))) {
    res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  }
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'DENY'); res.setHeader('Referrer-Policy', 'same-origin');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  try {
    if (url.pathname.startsWith('/api/')) {
      for (const r of routes) {
        if (r.method !== req.method) continue; const m = r.re.exec(url.pathname); if (!m) continue;
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
        return await r.handler({ req, res, url, ip }, ...m.slice(1));
      }
      throw new HttpError(404, 'Endpoint not found');
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpError(405, 'Method not allowed');
    serveStatic(req, res, url.pathname);
  } catch (e) {
    if (res.headersSent) return res.end();
    if (e instanceof HttpError) {
      // Frontend reads login errors as JSON {message} and register/other errors as text — send both-friendly JSON for login, text elsewhere
      if (url.pathname === '/api/auth/login') return sendJson(res, e.status, { message: e.message });
      return sendText(res, e.status, e.message);
    }
    console.error(e); sendText(res, 500, 'Internal server error');
  }
});

module.exports = server;
