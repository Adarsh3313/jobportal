'use strict';
// SQLite database: tables, migrations and small query helpers
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { DATA_DIR } = require('./config');

const db = new DatabaseSync(path.join(DATA_DIR, 'jobportal.db'));
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users(
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE, phone TEXT,
  passwordHash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('USER','HIRING_DEPARTMENT','ADMIN')),
  status TEXT NOT NULL DEFAULT 'ACTIVE', approved INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS companies(
  companyId INTEGER PRIMARY KEY AUTOINCREMENT, companyName TEXT NOT NULL UNIQUE,
  website TEXT, location TEXT, description TEXT, createdAt TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS jobs(
  jobId INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, location TEXT,
  salary TEXT, department TEXT, experience TEXT, employmentType TEXT, skills TEXT,
  priority TEXT DEFAULT 'Medium', companyName TEXT, status TEXT NOT NULL DEFAULT 'OPEN',
  postedBy INTEGER REFERENCES users(userId) ON DELETE SET NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS resumes(
  resumeId INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
  originalName TEXT, storedName TEXT NOT NULL, mimeType TEXT, size INTEGER, uploadedAt TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS applications(
  applicationId INTEGER PRIMARY KEY AUTOINCREMENT, jobId INTEGER NOT NULL REFERENCES jobs(jobId) ON DELETE CASCADE,
  userId INTEGER REFERENCES users(userId) ON DELETE SET NULL,
  applicantName TEXT, applicantEmail TEXT NOT NULL COLLATE NOCASE, resumeUrl TEXT,
  status TEXT NOT NULL DEFAULT 'APPLIED', appliedAt TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(jobId, applicantEmail));
CREATE TABLE IF NOT EXISTS interviews(
  interviewId INTEGER PRIMARY KEY AUTOINCREMENT, applicationId INTEGER NOT NULL REFERENCES applications(applicationId) ON DELETE CASCADE,
  candidateName TEXT, candidateEmail TEXT COLLATE NOCASE, interviewDate TEXT, interviewTime TEXT,
  mode TEXT, interviewer TEXT, meetingLink TEXT, createdAt TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS audit_logs(
  id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, user TEXT, severity TEXT DEFAULT 'LOW',
  time TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS offers(
  offerId INTEGER PRIMARY KEY AUTOINCREMENT, applicationId INTEGER NOT NULL UNIQUE REFERENCES applications(applicationId) ON DELETE CASCADE,
  designation TEXT, salary TEXT, joiningDate TEXT, location TEXT, message TEXT, validUntil TEXT,
  status TEXT NOT NULL DEFAULT 'SENT', issuedBy INTEGER, issuedAt TEXT NOT NULL DEFAULT (datetime('now')), respondedAt TEXT);
CREATE TABLE IF NOT EXISTS status_history(
  id INTEGER PRIMARY KEY AUTOINCREMENT, applicationId INTEGER NOT NULL REFERENCES applications(applicationId) ON DELETE CASCADE,
  status TEXT NOT NULL, note TEXT, changedBy TEXT, changedAt TEXT NOT NULL DEFAULT (datetime('now')));
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_app_job ON applications(jobId);
CREATE INDEX IF NOT EXISTS idx_app_email ON applications(applicantEmail);
`);

const q = {
  all: (sql, ...p) => db.prepare(sql).all(...p),
  get: (sql, ...p) => db.prepare(sql).get(...p),
  run: (sql, ...p) => db.prepare(sql).run(...p),
};
const audit = (action, user, severity = 'LOW') => q.run('INSERT INTO audit_logs(action,user,severity) VALUES(?,?,?)', action, user || 'system', severity);

// lightweight migrations for databases created by the first version
const addCol = (t, c, def) => { if (!q.all(`PRAGMA table_info(${t})`).some((x) => x.name === c)) db.exec(`ALTER TABLE ${t} ADD COLUMN ${c} ${def}`); };
addCol('users', 'companyName', 'TEXT');
addCol('users', 'companyWebsite', 'TEXT');
addCol('users', 'companyDetails', 'TEXT');
addCol('jobs', 'approvalStatus', "TEXT NOT NULL DEFAULT 'APPROVED'");
addCol('jobs', 'adminRemarks', 'TEXT');
addCol('jobs', 'reviewedAt', 'TEXT');
const track = (applicationId, status, note, by) => q.run('INSERT INTO status_history(applicationId,status,note,changedBy) VALUES(?,?,?,?)', applicationId, status, note || '', by || 'system');

module.exports = { db, q, audit, track };
