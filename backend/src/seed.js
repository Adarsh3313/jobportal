'use strict';
// Creates the first admin account when the database has none
const { q, audit } = require('./db');
const { hashPassword } = require('./utils/security');

(function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@jobportal.com').trim();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  if (!q.get("SELECT 1 FROM users WHERE role='ADMIN'")) {
    q.run("INSERT INTO users(fullName,email,phone,passwordHash,role,status,approved) VALUES(?,?,?,?,'ADMIN','ACTIVE',1)",
      process.env.ADMIN_NAME || 'Super Admin', email, '', hashPassword(password));
    audit('Admin account created', email, 'MEDIUM');
    console.log(`[seed] Admin created -> ${email}${process.env.ADMIN_PASSWORD ? '' : ' / Admin@123  (CHANGE THIS: set ADMIN_PASSWORD)'}`);
  }
})();
