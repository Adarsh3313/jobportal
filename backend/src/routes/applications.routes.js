'use strict';
// Applications: apply, list, change status, status history
const { route } = require('./registry');
const { q, track } = require('../db');
const { HttpError, readJson, sendJson, sendText, str } = require('../utils/http');
const { auth, STAFF, ANY, staffCanSeeJob } = require('../middleware/auth');

// Pipeline: APPLIED -> SHORTLISTED -> INTERVIEW -> SELECTED -> OFFER_SENT -> OFFER_ACCEPTED | OFFER_DECLINED  (REJECTED possible any time before an offer)
// Company sets the first five by hand; OFFER_* statuses are set only by the offer-letter endpoints below.
const APP_STATUS = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'];
const APP_SELECT = 'SELECT a.*, j.title AS jobTitle FROM applications a LEFT JOIN jobs j ON j.jobId=a.jobId';
route('POST', '/api/applications', async (c) => {
  const u = auth(c.req, c.url, ['USER']); const b = await readJson(c.req); const jobId = Number(b.jobId);
  const job = q.get('SELECT * FROM jobs WHERE jobId=?', jobId); if (!job) throw new HttpError(404, 'Job not found');
  if (job.approvalStatus !== 'APPROVED') throw new HttpError(404, 'Job not found');
  if (job.status !== 'OPEN') throw new HttpError(400, 'This job is closed');
  if (q.get('SELECT 1 FROM applications WHERE jobId=? AND applicantEmail=?', jobId, u.email)) throw new HttpError(409, 'You have already applied for this job');
  const resume = q.get('SELECT resumeId FROM resumes WHERE userId=?', u.userId);
  const ins = q.run('INSERT INTO applications(jobId,userId,applicantName,applicantEmail,resumeUrl) VALUES(?,?,?,?,?)', jobId, u.userId, str(b.applicantName, 100) || u.fullName, u.email, resume ? `/api/resumes/${resume.resumeId}/download` : '');
  track(ins.lastInsertRowid, 'APPLIED', 'Application submitted', u.email);
  sendText(c.res, 201, resume ? 'Application submitted successfully' : 'Application submitted. Tip: upload your resume so recruiters can see it.');
});
route('GET', '/api/applications', (c) => {
  const u = auth(c.req, c.url, ANY);
  if (u.role === 'ADMIN') return sendJson(c.res, 200, q.all(APP_SELECT + ' ORDER BY a.applicationId DESC'));
  if (u.role === 'USER') return sendJson(c.res, 200, q.all(APP_SELECT + ' WHERE a.applicantEmail=? ORDER BY a.applicationId DESC', u.email));
  sendJson(c.res, 200, q.all(APP_SELECT + ' WHERE j.postedBy=? ORDER BY a.applicationId DESC', u.userId));
});
route('GET', '/api/applications/job/:jobId', (c, jobId) => { const u = auth(c.req, c.url, STAFF); staffCanSeeJob(u, jobId); sendJson(c.res, 200, q.all(APP_SELECT + ' WHERE a.jobId=? ORDER BY a.applicationId DESC', jobId)); });
route('GET', '/api/applications/user/:email', (c, email) => {
  const u = auth(c.req, c.url, ANY); email = decodeURIComponent(email);
  if (u.role === 'USER' && u.email.toLowerCase() !== email.toLowerCase()) throw new HttpError(403, 'Not allowed');
  sendJson(c.res, 200, q.all(APP_SELECT + ' WHERE a.applicantEmail=? ORDER BY a.applicationId DESC', email));
});
route('PUT', '/api/applications/:id/status', (c, id) => {
  const u = auth(c.req, c.url, STAFF); const a = q.get('SELECT * FROM applications WHERE applicationId=?', id); if (!a) throw new HttpError(404, 'Application not found');
  staffCanSeeJob(u, a.jobId); const status = c.url.searchParams.get('status');
  if (!APP_STATUS.includes(status)) throw new HttpError(400, 'Invalid status. Use: ' + APP_STATUS.join(', '));
  if (a.status.startsWith('OFFER_')) throw new HttpError(400, 'An offer has already been issued; status is now controlled by the offer');
  q.run('UPDATE applications SET status=? WHERE applicationId=?', status, id);
  track(id, status, str(c.url.searchParams.get('note'), 500), u.email);
  sendJson(c.res, 200, q.get(APP_SELECT + ' WHERE a.applicationId=?', id));
});

route('GET', '/api/applications/:id/history', (c, id) => {
  const u = auth(c.req, c.url, ANY); const a = q.get('SELECT * FROM applications WHERE applicationId=?', id); if (!a) throw new HttpError(404, 'Application not found');
  if (u.role === 'USER' && a.applicantEmail.toLowerCase() !== u.email.toLowerCase()) throw new HttpError(403, 'Not allowed');
  if (u.role === 'HIRING_DEPARTMENT') staffCanSeeJob(u, a.jobId);
  sendJson(c.res, 200, q.all('SELECT status,note,changedBy,changedAt FROM status_history WHERE applicationId=? ORDER BY id', id));
});

