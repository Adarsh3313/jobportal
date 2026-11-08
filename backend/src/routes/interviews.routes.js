'use strict';
// Interviews: schedule and view
const { route } = require('./registry');
const { q, track } = require('../db');
const { HttpError, readJson, sendJson, str } = require('../utils/http');
const { auth, STAFF, ANY, staffCanSeeJob } = require('../middleware/auth');

route('POST', '/api/interviews', async (c) => {
  const u = auth(c.req, c.url, STAFF); const b = await readJson(c.req); const a = q.get('SELECT * FROM applications WHERE applicationId=?', Number(b.applicationId));
  if (!a) throw new HttpError(404, 'Application not found'); staffCanSeeJob(u, a.jobId);
  if (!str(b.interviewDate) || !str(b.interviewTime)) throw new HttpError(400, 'Interview date and time are required');
  const r = q.run('INSERT INTO interviews(applicationId,candidateName,candidateEmail,interviewDate,interviewTime,mode,interviewer,meetingLink) VALUES(?,?,?,?,?,?,?,?)',
    a.applicationId, a.applicantName, a.applicantEmail, str(b.interviewDate, 20), str(b.interviewTime, 20), str(b.mode, 50), str(b.interviewer, 100), str(b.meetingLink, 500));
  if (['APPLIED', 'SHORTLISTED', 'INTERVIEW'].includes(a.status)) q.run("UPDATE applications SET status='INTERVIEW' WHERE applicationId=?", a.applicationId);
  track(a.applicationId, 'INTERVIEW', `Interview scheduled for ${str(b.interviewDate, 20)} ${str(b.interviewTime, 20)}`, u.email);
  sendJson(c.res, 201, q.get('SELECT * FROM interviews WHERE interviewId=?', r.lastInsertRowid));
});
route('GET', '/api/interviews', (c) => {
  const u = auth(c.req, c.url, ANY);
  if (u.role === 'ADMIN') return sendJson(c.res, 200, q.all('SELECT * FROM interviews ORDER BY interviewDate, interviewTime'));
  if (u.role === 'USER') return sendJson(c.res, 200, q.all('SELECT * FROM interviews WHERE candidateEmail=? ORDER BY interviewDate, interviewTime', u.email));
  sendJson(c.res, 200, q.all('SELECT i.* FROM interviews i JOIN applications a ON a.applicationId=i.applicationId JOIN jobs j ON j.jobId=a.jobId WHERE j.postedBy=? ORDER BY i.interviewDate, i.interviewTime', u.userId));
});
route('GET', '/api/interviews/candidate/:email', (c, email) => {
  const u = auth(c.req, c.url, ANY); email = decodeURIComponent(email);
  if (u.role === 'USER' && u.email.toLowerCase() !== email.toLowerCase()) throw new HttpError(403, 'Not allowed');
  sendJson(c.res, 200, q.all('SELECT * FROM interviews WHERE candidateEmail=? ORDER BY interviewDate, interviewTime', email));
});

