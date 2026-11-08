# Deploy in 10 minutes (Render, one service, no config to write)

The whole project is **one app**: the backend serves the API and the website together. Nothing else to host.

## 1. Put the project on GitHub
1. Create a new empty repo on github.com (e.g. `jobapplication`).
2. In VS Code terminal, inside the `jobapplication` folder:
```bash
git init
git add .
git commit -m "Job portal"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/jobapplication.git
git push -u origin main
```

## 2. Create the service on Render
1. render.com -> **New +** -> **Blueprint** -> pick your repo. (`render.yaml` is already in the project.)
2. When asked, type a value for **ADMIN_PASSWORD** (your admin login password - make it strong).
3. Click **Apply**. Render installs, builds the frontend and starts the backend (about 3-5 minutes).
4. Open the URL Render gives you (e.g. `https://job-portal.onrender.com`).

Login: `admin@jobapplication.com` + the ADMIN_PASSWORD you typed.

## Important: keep your data
The database and uploaded resumes are files. They must live on a **persistent disk** or they are erased on every redeploy.
- `render.yaml` already adds a 1 GB disk at `/data` (needs Render's paid "Starter" plan).
- Free plan has no disk: fine for a demo, but data resets on redeploy/restart.

## Other ways
**Docker (any server / Railway / Fly):**
```bash
docker build -t jobapplication .
docker run -d -p 8080:8080 -v jobdata:/data -e JWT_SECRET=$(openssl rand -hex 32) -e ADMIN_PASSWORD='YourStrongPass' jobapplication
```
**Plain VPS with Node 22:** `npm run build && PORT=8080 DATA_DIR=/var/jobapplication ADMIN_PASSWORD=... npm start` (put Nginx/Caddy in front for HTTPS).

## Environment variables
| Name | Purpose |
|---|---|
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first admin (created on first start only) |
| `JWT_SECRET` | long random string (Render generates it) |
| `DATA_DIR` | folder for database + resumes (the persistent disk) |
| `PORT` | set automatically by most hosts |
