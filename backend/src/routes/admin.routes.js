'use strict';
// Admin: stats, users, approve/block/delete, add admin, audit log
const fs = require('node:fs');
const path = require('node:path');
const { route } = require('./registry');
const { q, audit } = require('../db');
const { hashPassword } = require('../utils/security');
const { HttpError, publicUser, readJson, sendJson, sendText, str, EMAIL_RE } = require('../utils/http');
const { auth, ADMIN } = require('../middleware/auth');
const { UPLOAD_DIR } = require('../config');

route('GET', '/api/admin/stats', (c) => {
  auth(c.req, c.url, ADMIN);
  const n = (sql) => q.get(sql).n;
  sendJson(c.res, 200, {
    users: n("SELECT COUNT(*) n FROM users WHERE role='USER'"),
    recruiters: n("SELECT COUNT(*) n FROM users WHERE role='HIRING_DEPARTMENT' AND approved=1"),
    admins: n("SELECT COUNT(*) n FROM users WHERE role='ADMIN'"),
    pendingRecruiters: n("SELECT COUNT(*) n FROM users WHERE role='HIRING_DEPARTMENT' AND approved=0"),
    activeUsers: n("SELECT COUNT(*) n FROM users WHERE status='ACTIVE'"),
    blockedUsers: n("SELECT COUNT(*) n FROM users WHERE status='BLOCKED'"),
    jobs: n('SELECT COUNT(*) n FROM jobs'), pendingJobs: n("SELECT COUNT(*) n FROM jobs WHERE approvalStatus='PENDING'"), offers: n('SELECT COUNT(*) n FROM offers'), applications: n('SELECT COUNT(*) n FROM applications'),
  });
});
route('GET', '/api/admin/users', (c) => { auth(c.req, c.url, ADMIN); sendJson(c.res, 200, q.all('SELECT * FROM users ORDER BY userId DESC').map(publicUser)); });
route('GET', '/api/admin/pending-recruiters', (c) => { auth(c.req, c.url, ADMIN); sendJson(c.res, 200, q.all("SELECT * FROM users WHERE role='HIRING_DEPARTMENT' AND approved=0 ORDER BY userId DESC").map(publicUser)); });
route('PUT', '/api/admin/approve/:id', (c, id) => {
  const me = auth(c.req, c.url, ADMIN); const u = q.get("SELECT * FROM users WHERE userId=? AND role='HIRING_DEPARTMENT'", id);
  if (!u) throw new HttpError(404, 'Recruiter not found');
  q.run("UPDATE users SET approved=1,status='ACTIVE' WHERE userId=?", id); audit('Recruiter Approved', u.email); sendText(c.res, 200, 'Recruiter approved');
});
route('PUT', '/api/admin/activate/:id', (c, id) => {
  auth(c.req, c.url, ADMIN); const u = q.get('SELECT * FROM users WHERE userId=?', id); if (!u) throw new HttpError(404, 'User not found');
  q.run("UPDATE users SET status='ACTIVE' WHERE userId=?", id); audit('User Activated', u.email); sendText(c.res, 200, 'User activated');
});
route('PUT', '/api/admin/block/:id', (c, id) => {
  const me = auth(c.req, c.url, ADMIN); const u = q.get('SELECT * FROM users WHERE userId=?', id); if (!u) throw new HttpError(404, 'User not found');
  if (u.userId === me.userId) throw new HttpError(400, 'You cannot block yourself');
  q.run("UPDATE users SET status='BLOCKED' WHERE userId=?", id); audit('User Blocked', u.email, 'HIGH'); sendText(c.res, 200, 'User blocked');
});
route('DELETE', '/api/admin/users/:id', (c, id) => {
  const me = auth(c.req, c.url, ADMIN); const u = q.get('SELECT * FROM users WHERE userId=?', id); if (!u) throw new HttpError(404, 'User not found');
  if (u.userId === me.userId) throw new HttpError(400, 'You cannot delete yourself');
  for (const r of q.all('SELECT storedName FROM resumes WHERE userId=?', id)) fs.rmSync(path.join(UPLOAD_DIR, r.storedName), { force: true });
  q.run('DELETE FROM users WHERE userId=?', id); audit(u.approved ? 'User Deleted' : 'Recruiter Rejected', u.email, 'HIGH'); sendText(c.res, 200, 'User deleted');
});
route('POST', '/api/admin/admins', async (c) => {
  const me = auth(c.req, c.url, ADMIN); const b = await readJson(c.req);
  const fullName = str(b.fullName, 100), email = str(b.email, 200).toLowerCase(), password = String(b.password || '');
  if (!fullName || !EMAIL_RE.test(email) || password.length < 6) throw new HttpError(400, 'Valid name, email and a password of 6+ characters are required');
  if (q.get('SELECT 1 FROM users WHERE email=?', email)) throw new HttpError(409, 'Email already registered');
  q.run("INSERT INTO users(fullName,email,phone,passwordHash,role,status,approved) VALUES(?,?,?,?,'ADMIN','ACTIVE',1)", fullName, email, str(b.phone, 30), hashPassword(password));
  audit('Admin Created', `${me.email} -> ${email}`, 'HIGH'); sendText(c.res, 201, 'Admin created');
});
route('GET', '/api/admin/audit-logs', (c) => { auth(c.req, c.url, ADMIN); sendJson(c.res, 200, q.all('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 500')); });

