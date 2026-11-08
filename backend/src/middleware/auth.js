'use strict';
// Login check + role check, and the failed-login throttle
const { q } = require('../db');
const { verify } = require('../utils/security');
const { HttpError } = require('../utils/http');

const ADMIN = ['ADMIN'];
const STAFF = ['HIRING_DEPARTMENT', 'ADMIN']; // company + admin
const ANY = ['USER', 'HIRING_DEPARTMENT', 'ADMIN'];

function auth(req, url, roles) {
  let token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token || token === 'null' || token === 'undefined') token = url.searchParams.get('token') || '';
  const p = verify(token);
  if (!p) { if (roles) throw new HttpError(401, 'Please log in'); return null; }
  const u = q.get('SELECT * FROM users WHERE userId=?', p.sub);
  if (!u) { if (roles) throw new HttpError(401, 'Account no longer exists'); return null; }
  if (u.status === 'BLOCKED') throw new HttpError(403, 'Your account is blocked');
  if (roles && !roles.includes(u.role)) throw new HttpError(403, 'You do not have permission to do this');
  if (roles && u.role === 'HIRING_DEPARTMENT' && !u.approved) throw new HttpError(403, 'Recruiter account is pending admin approval');
  return u;
}

// simple in-memory login throttle: 10 failures / 15 min per ip+email
const fails = new Map();
const throttled = (k) => { const f = fails.get(k); return f && f.n >= 10 && Date.now() - f.t < 15 * 60e3; };
const noteFail = (k) => { const f = fails.get(k); fails.set(k, f && Date.now() - f.t < 15 * 60e3 ? { n: f.n + 1, t: f.t } : { n: 1, t: Date.now() }); };

// A company may only touch applications of its own jobs (admins can touch all)
const staffCanSeeJob = (u, jobId) => { if (u.role === 'ADMIN') return; const j = q.get('SELECT postedBy FROM jobs WHERE jobId=?', jobId); if (!j || j.postedBy !== u.userId) throw new HttpError(403, 'Not your job'); };

module.exports = { auth, throttled, noteFail, fails, ADMIN, STAFF, ANY, staffCanSeeJob };
