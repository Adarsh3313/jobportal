'use strict';
// Jobs: create, list, edit, delete, and admin approval of jobs
const { route } = require('./registry');
const { q, audit } = require('../db');
const { HttpError, readJson, sendJson, sendText, str } = require('../utils/http');
const { auth, ADMIN, STAFF } = require('../middleware/auth');

const jobFields = (b) => ({
  title: str(b.title, 200), description: str(b.description, 10000), location: str(b.location, 200), salary: str(b.salary, 100),
  department: str(b.department, 100), experience: str(b.experience, 100), employmentType: str(b.employmentType, 100), skills: str(b.skills, 1000),
  priority: str(b.priority, 20) || 'Medium', companyName: str(b.companyName, 150),
});
const companyOf = (u) => u.companyName || '';
route('GET', '/api/jobs', (c) => {
  const u = c.url.searchParams.get('mine') ? auth(c.req, c.url, STAFF) : null;
  // Job seekers (and the public) only ever see jobs the admin has approved
  if (!u) return sendJson(c.res, 200, q.all("SELECT * FROM jobs WHERE status='OPEN' AND approvalStatus='APPROVED' ORDER BY jobId DESC"));
  sendJson(c.res, 200, u.role === 'ADMIN' ? q.all('SELECT * FROM jobs ORDER BY jobId DESC') : q.all('SELECT * FROM jobs WHERE postedBy=? ORDER BY jobId DESC', u.userId));
});
route('GET', '/api/jobs/:id', (c, id) => {
  const j = q.get('SELECT * FROM jobs WHERE jobId=?', id); if (!j) throw new HttpError(404, 'Job not found');
  if (j.approvalStatus !== 'APPROVED') { // unapproved jobs are only visible to the owner company and admins
    const u = auth(c.req, c.url, null);
    if (!u || (u.role !== 'ADMIN' && j.postedBy !== u.userId)) throw new HttpError(404, 'Job not found');
  }
  sendJson(c.res, 200, j);
});
route('GET', '/api/admin/jobs/pending', (c) => { auth(c.req, c.url, ADMIN); sendJson(c.res, 200, q.all(`SELECT j.*, u.fullName AS recruiterName, u.email AS recruiterEmail, u.companyName AS recruiterCompany FROM jobs j LEFT JOIN users u ON u.userId=j.postedBy WHERE j.approvalStatus='PENDING' ORDER BY j.jobId DESC`)); });
route('GET', '/api/admin/jobs', (c) => { auth(c.req, c.url, ADMIN); sendJson(c.res, 200, q.all(`SELECT j.*, u.fullName AS recruiterName, u.email AS recruiterEmail FROM jobs j LEFT JOIN users u ON u.userId=j.postedBy ORDER BY j.jobId DESC`)); });
route('PUT', '/api/admin/jobs/:id/review', async (c, id) => {
  const me = auth(c.req, c.url, ADMIN); const j = q.get('SELECT * FROM jobs WHERE jobId=?', id); if (!j) throw new HttpError(404, 'Job not found');
  const b = await readJson(c.req); const decision = b.decision;
  if (!['APPROVED', 'REJECTED'].includes(decision)) throw new HttpError(400, 'decision must be APPROVED or REJECTED');
  if (decision === 'REJECTED' && !str(b.remarks)) throw new HttpError(400, 'Please give a reason so the company can fix the job');
  q.run("UPDATE jobs SET approvalStatus=?, adminRemarks=?, reviewedAt=datetime('now') WHERE jobId=?", decision, str(b.remarks, 1000), id);
  audit(`Job ${decision === 'APPROVED' ? 'Approved' : 'Rejected'}: ${j.title}`, me.email, decision === 'APPROVED' ? 'LOW' : 'MEDIUM');
  sendText(c.res, 200, `Job ${decision.toLowerCase()}`);
});
route('POST', '/api/jobs', async (c) => {
  const u = auth(c.req, c.url, STAFF); const f = jobFields(await readJson(c.req));
  if (!f.title) throw new HttpError(400, 'Job title is required');
  const approval = u.role === 'ADMIN' ? 'APPROVED' : 'PENDING'; // company jobs wait for admin review
  q.run('INSERT INTO jobs(title,description,location,salary,department,experience,employmentType,skills,priority,companyName,postedBy,approvalStatus) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
    f.title, f.description, f.location, f.salary, f.department, f.experience, f.employmentType, f.skills, f.priority, f.companyName || companyOf(u), u.userId, approval);
  audit('Job Submitted: ' + f.title, u.email);
  sendText(c.res, 201, approval === 'APPROVED' ? 'Job created and published' : 'Job submitted. It will be visible to job seekers after admin approval.');
});
const ownJob = (u, id) => { const j = q.get('SELECT * FROM jobs WHERE jobId=?', id); if (!j) throw new HttpError(404, 'Job not found'); if (u.role !== 'ADMIN' && j.postedBy !== u.userId) throw new HttpError(403, 'You can only change your own jobs'); return j; };
route('PUT', '/api/jobs/:id', async (c, id) => {
  const u = auth(c.req, c.url, STAFF); const j = ownJob(u, id); const b = await readJson(c.req); const f = jobFields({ ...j, ...b });
  const status = ['OPEN', 'CLOSED'].includes(b.status) ? b.status : j.status;
  const contentChanged = ['title', 'description', 'location', 'salary', 'department', 'experience', 'employmentType', 'skills'].some((k) => f[k] !== str(j[k], 10000));
  const approval = u.role !== 'ADMIN' && contentChanged ? 'PENDING' : j.approvalStatus; // edits to details need re-approval
  q.run('UPDATE jobs SET title=?,description=?,location=?,salary=?,department=?,experience=?,employmentType=?,skills=?,priority=?,companyName=?,status=?,approvalStatus=? WHERE jobId=?',
    f.title, f.description, f.location, f.salary, f.department, f.experience, f.employmentType, f.skills, f.priority, f.companyName, status, approval, id);
  sendJson(c.res, 200, q.get('SELECT * FROM jobs WHERE jobId=?', id));
});
route('DELETE', '/api/jobs/:id', (c, id) => { const u = auth(c.req, c.url, STAFF); const j = ownJob(u, id); q.run('DELETE FROM jobs WHERE jobId=?', id); audit('Job Deleted: ' + j.title, u.email, 'MEDIUM'); sendText(c.res, 200, 'Job deleted'); });

