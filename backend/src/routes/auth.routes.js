'use strict';
// Register, login, current user, change password
const { route } = require('./registry');
const { q, audit } = require('../db');
const { hashPassword, checkPassword, sign } = require('../utils/security');
const { HttpError, publicUser, readJson, sendJson, sendText, str, EMAIL_RE } = require('../utils/http');
const { auth, throttled, noteFail, fails, ANY } = require('../middleware/auth');

route('POST', '/api/auth/register', async (c) => {
  const b = await readJson(c.req);
  const fullName = str(b.fullName, 100), email = str(b.email, 200).toLowerCase(), phone = str(b.phone, 30), password = String(b.password || '');
  const role = b.role === 'HIRING_DEPARTMENT' ? 'HIRING_DEPARTMENT' : 'USER'; // ADMIN can never self-register
  if (!fullName || !email || !password) throw new HttpError(400, 'Name, email and password are required');
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Invalid email address');
  if (password.length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  if (q.get('SELECT 1 FROM users WHERE email=?', email)) throw new HttpError(409, 'Email already registered');
  const approved = role === 'USER' ? 1 : 0;
  const companyName = str(b.companyName, 150);
  if (role === 'HIRING_DEPARTMENT' && !companyName) throw new HttpError(400, 'Company name is required for company accounts');
  q.run('INSERT INTO users(fullName,email,phone,passwordHash,role,status,approved,companyName,companyWebsite,companyDetails) VALUES(?,?,?,?,?,?,?,?,?,?)', fullName, email, phone, hashPassword(password), role, approved ? 'ACTIVE' : 'PENDING', approved,
    role === 'HIRING_DEPARTMENT' ? companyName : null, str(b.companyWebsite, 200), str(b.companyDetails, 2000));
  if (role === 'HIRING_DEPARTMENT' && !q.get('SELECT 1 FROM companies WHERE companyName=? COLLATE NOCASE', companyName)) q.run('INSERT INTO companies(companyName,website,description) VALUES(?,?,?)', companyName, str(b.companyWebsite, 200), str(b.companyDetails, 2000));
  audit(`New ${role === 'USER' ? 'user' : 'recruiter'} registered`, email);
  sendText(c.res, 201, approved ? 'Registration successful. You can now log in.' : 'Registration successful. Your recruiter account must be approved by an admin before you can log in.');
});
route('POST', '/api/auth/login', async (c) => {
  const b = await readJson(c.req); const email = str(b.email, 200).toLowerCase(); const key = c.ip + '|' + email;
  if (throttled(key)) throw new HttpError(429, 'Too many failed attempts. Try again in 15 minutes.');
  const u = q.get('SELECT * FROM users WHERE email=?', email);
  if (!u || !checkPassword(String(b.password || ''), u.passwordHash)) { noteFail(key); throw new HttpError(401, 'Invalid email or password'); }
  if (u.status === 'BLOCKED') throw new HttpError(403, 'Your account has been blocked. Contact the administrator.');
  if (u.role === 'HIRING_DEPARTMENT' && !u.approved) throw new HttpError(403, 'Your recruiter account is waiting for admin approval.');
  fails.delete(key);
  sendJson(c.res, 200, { token: sign({ sub: u.userId, role: u.role }), role: u.role, userId: u.userId, fullName: u.fullName, email: u.email });
});
route('GET', '/api/auth/me', (c) => sendJson(c.res, 200, publicUser(auth(c.req, c.url, ANY))));
route('PUT', '/api/auth/password', async (c) => {
  const u = auth(c.req, c.url, ANY); const b = await readJson(c.req);
  if (!checkPassword(String(b.currentPassword || ''), u.passwordHash)) throw new HttpError(400, 'Current password is incorrect');
  if (String(b.newPassword || '').length < 6) throw new HttpError(400, 'New password must be at least 6 characters');
  q.run('UPDATE users SET passwordHash=? WHERE userId=?', hashPassword(String(b.newPassword)), u.userId);
  sendText(c.res, 200, 'Password updated');
});

