'use strict';
// Companies list / add / delete
const { route } = require('./registry');
const { q } = require('../db');
const { HttpError, readJson, sendJson, sendText, str } = require('../utils/http');
const { auth, ADMIN } = require('../middleware/auth');

route('GET', '/api/companies', (c) => sendJson(c.res, 200, q.all('SELECT * FROM companies ORDER BY companyName')));
route('GET', '/api/companies/:id', (c, id) => { const r = q.get('SELECT * FROM companies WHERE companyId=?', id); if (!r) throw new HttpError(404, 'Company not found'); sendJson(c.res, 200, r); });
route('POST', '/api/companies', async (c) => {
  auth(c.req, c.url, ADMIN); const b = await readJson(c.req); const name = str(b.companyName, 150); if (!name) throw new HttpError(400, 'Company name is required');
  if (q.get('SELECT 1 FROM companies WHERE companyName=? COLLATE NOCASE', name)) throw new HttpError(409, 'Company already exists');
  const r = q.run('INSERT INTO companies(companyName,website,location,description) VALUES(?,?,?,?)', name, str(b.website, 200), str(b.location, 200), str(b.description));
  sendJson(c.res, 201, q.get('SELECT * FROM companies WHERE companyId=?', r.lastInsertRowid));
});
route('DELETE', '/api/companies/:id', (c, id) => { auth(c.req, c.url, ADMIN); q.run('DELETE FROM companies WHERE companyId=?', id); sendText(c.res, 200, 'Company deleted'); });

