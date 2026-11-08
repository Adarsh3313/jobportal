'use strict';
// Offer letters: company issues, candidate accepts / declines
const { route } = require('./registry');
const { q, audit, track } = require('../db');
const { HttpError, readJson, sendJson, sendText, str } = require('../utils/http');
const { auth, STAFF, ANY, staffCanSeeJob } = require('../middleware/auth');

route('POST', '/api/offers', async (c) => {
  const u = auth(c.req, c.url, STAFF); const b = await readJson(c.req); const a = q.get('SELECT * FROM applications WHERE applicationId=?', Number(b.applicationId));
  if (!a) throw new HttpError(404, 'Application not found'); staffCanSeeJob(u, a.jobId);
  if (a.status !== 'SELECTED') throw new HttpError(400, 'Mark the candidate as SELECTED before sending an offer letter');
  if (q.get('SELECT 1 FROM offers WHERE applicationId=?', a.applicationId)) throw new HttpError(409, 'An offer was already issued for this application');
  const job = q.get('SELECT * FROM jobs WHERE jobId=?', a.jobId);
  const f = { designation: str(b.designation, 150) || job.title, salary: str(b.salary, 100) || job.salary, joiningDate: str(b.joiningDate, 20), location: str(b.location, 200) || job.location, message: str(b.message, 3000), validUntil: str(b.validUntil, 20) };
  if (!f.joiningDate) throw new HttpError(400, 'Joining date is required');
  const r = q.run('INSERT INTO offers(applicationId,designation,salary,joiningDate,location,message,validUntil,issuedBy) VALUES(?,?,?,?,?,?,?,?)', a.applicationId, f.designation, f.salary, f.joiningDate, f.location, f.message, f.validUntil, u.userId);
  q.run("UPDATE applications SET status='OFFER_SENT' WHERE applicationId=?", a.applicationId); track(a.applicationId, 'OFFER_SENT', 'Offer letter issued', u.email);
  audit('Offer Letter Issued: ' + a.applicantEmail, u.email); sendJson(c.res, 201, q.get('SELECT * FROM offers WHERE offerId=?', r.lastInsertRowid));
});
const OFFER_SELECT = `SELECT o.*, a.applicantName, a.applicantEmail, a.jobId, j.title AS jobTitle, j.companyName FROM offers o JOIN applications a ON a.applicationId=o.applicationId JOIN jobs j ON j.jobId=a.jobId`;
route('GET', '/api/offers', (c) => {
  const u = auth(c.req, c.url, ANY);
  if (u.role === 'ADMIN') return sendJson(c.res, 200, q.all(OFFER_SELECT + ' ORDER BY o.offerId DESC'));
  if (u.role === 'USER') return sendJson(c.res, 200, q.all(OFFER_SELECT + ' WHERE a.applicantEmail=? ORDER BY o.offerId DESC', u.email));
  sendJson(c.res, 200, q.all(OFFER_SELECT + ' WHERE j.postedBy=? ORDER BY o.offerId DESC', u.userId));
});
route('PUT', '/api/offers/:id/respond', async (c, id) => {
  const u = auth(c.req, c.url, ['USER']); const b = await readJson(c.req); const o = q.get(OFFER_SELECT + ' WHERE o.offerId=?', id);
  if (!o || o.applicantEmail.toLowerCase() !== u.email.toLowerCase()) throw new HttpError(404, 'Offer not found');
  if (o.status !== 'SENT') throw new HttpError(400, 'You have already responded to this offer');
  if (o.validUntil && new Date(o.validUntil + 'T23:59:59') < new Date()) throw new HttpError(400, 'This offer has expired');
  const accept = b.decision === 'ACCEPTED'; if (!accept && b.decision !== 'DECLINED') throw new HttpError(400, 'decision must be ACCEPTED or DECLINED');
  q.run("UPDATE offers SET status=?, respondedAt=datetime('now') WHERE offerId=?", b.decision, id);
  const st = accept ? 'OFFER_ACCEPTED' : 'OFFER_DECLINED'; q.run('UPDATE applications SET status=? WHERE applicationId=?', st, o.applicationId); track(o.applicationId, st, str(b.note, 500), u.email);
  audit(`Offer ${b.decision}: ${o.applicantEmail} / ${o.jobTitle}`, u.email); sendText(c.res, 200, accept ? 'Offer accepted. Congratulations!' : 'Offer declined');
});

