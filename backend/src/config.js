'use strict';
// Settings read from environment variables (or the .env file in backend/)
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.join(__dirname, '..'); // backend/

// tiny .env loader (no dotenv package needed)
try {
  for (const line of fs.readFileSync(path.join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !line.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env, fine */ }

const PORT = Number(process.env.PORT) || 8080;
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'));
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const FRONTEND_DIST = path.resolve(process.env.FRONTEND_DIST || path.join(ROOT, '..', 'frontend', 'dist'));
const CORS_ORIGINS = (process.env.CORS_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
const MAX_JSON = 1024 * 1024;
const MAX_UPLOAD = 5 * 1024 * 1024;
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// JWT secret: env, else generated once and saved (so logins survive restarts)
let SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  const f = path.join(DATA_DIR, '.jwt_secret');
  if (fs.existsSync(f)) SECRET = fs.readFileSync(f, 'utf8');
  else { SECRET = crypto.randomBytes(48).toString('hex'); fs.writeFileSync(f, SECRET, { mode: 0o600 }); }
}

module.exports = { PORT, DATA_DIR, UPLOAD_DIR, FRONTEND_DIST, CORS_ORIGINS, MAX_JSON, MAX_UPLOAD, SECRET };
