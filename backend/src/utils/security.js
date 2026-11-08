'use strict';
// Password hashing (scrypt) and login tokens (HMAC-signed JWT)
const crypto = require('node:crypto');
const { SECRET } = require('../config');

const hashPassword = (pw) => { const salt = crypto.randomBytes(16); return `${salt.toString('hex')}:${crypto.scryptSync(pw, salt, 64).toString('hex')}`; };
const checkPassword = (pw, stored) => {
  const [s, h] = String(stored).split(':'); if (!s || !h) return false;
  const a = crypto.scryptSync(pw, Buffer.from(s, 'hex'), 64), b = Buffer.from(h, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const sign = (payload, ttl = 7 * 86400) => {
  const body = b64({ ...payload, exp: Math.floor(Date.now() / 1000) + ttl });
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${body}.${crypto.createHmac('sha256', SECRET).update(`${b64({ alg: 'HS256', typ: 'JWT' })}.${body}`).digest('base64url')}`;
};
const verify = (token) => {
  const parts = String(token || '').split('.'); if (parts.length !== 3) return null;
  const exp = crypto.createHmac('sha256', SECRET).update(`${parts[0]}.${parts[1]}`).digest();
  const got = Buffer.from(parts[2], 'base64url');
  if (exp.length !== got.length || !crypto.timingSafeEqual(exp, got)) return null;
  try { const p = JSON.parse(Buffer.from(parts[1], 'base64url').toString()); return p.exp > Date.now() / 1000 ? p : null; } catch { return null; }
};

module.exports = { hashPassword, checkPassword, sign, verify };
