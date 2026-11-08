'use strict';
// Resume upload / list / download
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { route } = require('./registry');
const { q } = require('../db');
const { HttpError, readBody, sendJson, sendText } = require('../utils/http');
const { parseMultipart, RESUME_TYPES } = require('../utils/multipart');
const { auth, ANY } = require('../middleware/auth');
const { UPLOAD_DIR, MAX_UPLOAD } = require('../config');

route('POST', '/api/resumes/upload', async (c) => {
  const u = auth(c.req, c.url, ['USER']);
  const buf = await readBody(c.req, MAX_UPLOAD + 4096); const { file } = parseMultipart(buf, c.req.headers['content-type']);
  if (!file || !file.data.length) throw new HttpError(400, 'Please choose a resume file');
  const ext = path.extname(file.filename).toLowerCase();
  if (!RESUME_TYPES[ext]) throw new HttpError(400, 'Only PDF, DOC or DOCX files are allowed');
  if (file.data.length > MAX_UPLOAD) throw new HttpError(413, 'File too large (max 5 MB)');
  const stored = crypto.randomUUID() + ext; fs.writeFileSync(path.join(UPLOAD_DIR, stored), file.data);
  for (const old of q.all('SELECT storedName FROM resumes WHERE userId=?', u.userId)) fs.rmSync(path.join(UPLOAD_DIR, old.storedName), { force: true });
  q.run('DELETE FROM resumes WHERE userId=?', u.userId); // one resume per user: latest wins
  const r = q.run('INSERT INTO resumes(userId,originalName,storedName,mimeType,size) VALUES(?,?,?,?,?)', u.userId, path.basename(file.filename).slice(0, 200), stored, RESUME_TYPES[ext], file.data.length);
  q.run("UPDATE applications SET resumeUrl=? WHERE userId=? AND status='APPLIED'", `/api/resumes/${r.lastInsertRowid}/download`, u.userId);
  sendText(c.res, 201, 'Resume uploaded successfully');
});
route('GET', '/api/resumes', (c) => {
  const u = auth(c.req, c.url, ANY);
  const sql = 'SELECT r.resumeId,r.userId,r.originalName,r.size,r.uploadedAt,u.fullName,u.email FROM resumes r JOIN users u ON u.userId=r.userId';
  sendJson(c.res, 200, u.role === 'USER' ? q.all(sql + ' WHERE r.userId=?', u.userId) : q.all(sql + ' ORDER BY r.resumeId DESC'));
});
route('GET', '/api/resumes/:id/download', (c, id) => {
  const u = auth(c.req, c.url, ANY); const r = q.get('SELECT * FROM resumes WHERE resumeId=?', id);
  if (!r) throw new HttpError(404, 'Resume not found');
  if (u.role === 'USER' && r.userId !== u.userId) throw new HttpError(403, 'Not allowed');
  const data = fs.readFileSync(path.join(UPLOAD_DIR, r.storedName));
  c.res.writeHead(200, { 'Content-Type': r.mimeType, 'Content-Length': data.length, 'Content-Disposition': `inline; filename="${r.originalName.replace(/[^\w.\- ]/g, '_')}"` }); c.res.end(data);
});

