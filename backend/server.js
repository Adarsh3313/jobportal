'use strict';
/**
 * Job Portal backend - entry point.  Start with:  npm start
 * Zero npm dependencies. Needs Node >= 22.5 (built-in node:sqlite).
 *
 * src/config.js            settings (.env, ports, secret)
 * src/db.js                tables + migrations
 * src/seed.js              first admin account
 * src/app.js               HTTP server, CORS, static frontend
 * src/middleware/auth.js   login + role checks
 * src/utils/*              passwords/tokens, request helpers, multipart parser
 * src/routes/*             API endpoints (auth, admin, companies, jobs, resumes,
 *                          applications, offers, interviews)
 */
const { PORT } = require('./src/config');
const { db } = require('./src/db');
require('./src/seed');
const server = require('./src/app');

module.exports = { server, db };
if (require.main === module) server.listen(PORT, () => console.log(`Job Portal running on http://localhost:${PORT}`));
