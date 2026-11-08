'use strict';
// Request/response helpers shared by every route
const { MAX_JSON } = require('../config');

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const publicUser = (u) => u && ({ userId: u.userId, fullName: u.fullName, email: u.email, phone: u.phone, companyName: u.companyName, companyWebsite: u.companyWebsite, companyDetails: u.companyDetails, role: u.role, status: u.status, approved: !!u.approved, createdAt: u.createdAt });

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = []; let n = 0;
    req.on('data', (c) => { n += c.length; if (n > limit) { reject(new HttpError(413, 'Request too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
async function readJson(req) {
  const buf = await readBody(req, MAX_JSON);
  if (!buf.length) return {};
  try { return JSON.parse(buf.toString('utf8')); } catch { throw new HttpError(400, 'Invalid JSON body'); }
}
const sendJson = (res, status, data) => { const b = JSON.stringify(data); res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(b) }); res.end(b); };
const sendText = (res, status, text) => { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(text); };

const str = (v, max = 2000) => (v === undefined || v === null ? '' : String(v).trim().slice(0, max));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = { HttpError, publicUser, readBody, readJson, sendJson, sendText, str, EMAIL_RE };
