# Job Portal (React + Node/SQLite)

One app: the backend serves the API (`/api/*`) **and** the built React frontend, so you deploy a single service.
The five separate microservice ports the old frontend expected (8083/8084/8085/8088/8010) are gone — everything is on one port.

## First admin login
Created automatically on first start:

| Email | Password |
|---|---|
| `admin@jobportal.com` | `Admin@123` |

**Change this before going live** by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` *before the first start*
(or log in, open *Manage Users → Add Admin*, create your own admin, then delete the default one).
Admins can never self-register; only an admin can create another admin.

## The 3 roles and the hiring flow
1. **Company** registers (with company name/website/details) → **admin approves the company account** (Admin → Recruiters).
2. Company adds hiring details (**Create Job**) → the job is **PENDING**. Editing a job's details sends it back to PENDING.
3. **Admin checks the details** (Admin → **Review Jobs**) → **Approve**, or **Reject with a reason** (the company sees the reason and can fix it).
4. **Only approved jobs are visible to job seekers.** Job seeker registers → uploads resume → applies (once per job).
5. Company moves each applicant through the pipeline; every change is recorded with a timestamp:

   `APPLIED → SHORTLISTED → INTERVIEW (schedule date/time/link) → SELECTED → OFFER_SENT (offer letter) → OFFER_ACCEPTED / OFFER_DECLINED`  (`REJECTED` possible before an offer)
6. Candidate sees status, interview details, the **offer letter** (designation, salary, joining date, message) and **accepts or declines** it from *My Applications*, with the full history.

Admins also: block/delete users, add other admins, manage companies, see all jobs/applications/offers, audit log, reports.
Companies only ever see their own jobs/applicants; job seekers only their own data.

## Backend structure
```
backend/
├── server.js                  entry point (npm start)
├── .env.example               settings template -> copy to .env
├── test.js                    65 automatic API tests (npm test)
└── src/
    ├── config.js              ports, secret, folders
    ├── db.js                  SQLite tables + migrations
    ├── seed.js                creates the first admin
    ├── app.js                 HTTP server, CORS, serves the website
    ├── middleware/auth.js     login + role checks
    ├── utils/                 security.js, http.js, multipart.js
    └── routes/                auth, admin, companies, jobs, resumes,
                               applications, offers, interviews
```

## Run locally
Needs Node 22.5+ (uses the built-in SQLite, so the backend has **no npm dependencies**).

```bash
# terminal 1 - backend on :8080
cd backend && cp .env.example .env && npm start

# terminal 2 - frontend on :5173 (proxies /api to :8080)
cd frontend && npm install && npm run dev
```
Open http://localhost:5173

Production-style single server:
```bash
npm run build     # installs frontend deps + builds frontend/dist
npm start         # http://localhost:8080  (API + website)
```

## Deploy
**Any Node host (Render, Railway, VPS):** build command `npm run build`, start command `npm start`, Node 22.
Set env vars: `JWT_SECRET` (long random), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `DATA_DIR` pointing to a **persistent disk** (SQLite file + uploaded resumes live there; without a disk they vanish on every redeploy).

**Docker:** `docker build -t jobportal . && docker run -p 8080:8080 -v jobdata:/data -e JWT_SECRET=... -e ADMIN_PASSWORD=... jobportal`

`render.yaml` is included for one-click Render setup. **Step-by-step: see DEPLOY.md.**

**Frontend on a different domain (e.g. Vercel)?** Build it with `VITE_API_URL=https://your-backend` and set backend `CORS_ORIGIN=https://your-frontend`.

## Tests
`npm test` runs 65 end-to-end API checks (auth, roles, approval flow, jobs, applications, resumes, interviews, admin).

## What was fixed vs. the original frontend
- No backend existed → built one (auth, jobs, applications, interviews, resumes, companies, admin, audit log).
- No admin could log in → seeded admin + "Add Admin" screen; admin role cannot be self-assigned.
- Hard-coded `localhost:80xx` URLs → one shared `services/http.js` (adds the login token to every call, logs out on expired session).
- Admin pages (`/applications`, `/audit-logs`) were open to anyone → now ADMIN-only; admins can also open Manage Jobs / Applicants.
- Applications table read wrong fields (`email`, `id`) → fixed (`applicantEmail`, `applicationId`).
- Apply form: name/email now come from the logged-in account (can't apply as someone else); duplicate applications blocked.
- Resume upload no longer asks you to type a User ID; PDF/DOC/DOCX only, 5 MB max; recruiters can open the resume from the applicants table.
- Recruiters only see/manage their own jobs and applicants; job seekers only see their own data.
- Audit logs were hard-coded fake rows → now real events. Companies page now has add/delete.
- Real error messages shown on login/register/apply instead of generic "failed".
