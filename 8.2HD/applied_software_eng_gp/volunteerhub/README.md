# VolunteerHub - Dockerized End-to-End Deployment (SIT725 8.2HD)

This is my individual Dockerised submission for the VolunteerHub group project.
It runs as a full stack Docker deployment with `frontend`, `backend`, and `mongo`.

## 1) Prerequisites

- Docker Desktop installed and running
- Git installed

## 2) Required setup before first run

Run these commands from the `volunteerhub` directory.

**Note:** Both `backend/.env` and `frontend/.env` are required. Docker Compose will not start without them.

PowerShell (Windows):

```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

If Windows asks to overwrite an existing `.env` file, choose **No** (keep your existing file).

Bash/macOS/Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` and set your own values:

- `JWT_SECRET` (strong random secret)
- `STUDENT_NAME`
- `STUDENT_ID`

Keep these lines as shown in `.env.example`:

- `MONGO_URI=mongodb://mongo:27017/volunteerhub`

`frontend/.env` can stay as copied from `.env.example` for Docker (Compose sets the container proxy settings).

## 3) Build and start the containerized application

```bash
docker compose up --build
```

Wait until all three containers are running (`mongo`, `backend`, `frontend`).

## 4) Localhost ports used by this application

- Frontend (UI): `http://localhost:3300`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

## 5) Required HD endpoint verification

Open in a browser:

- `http://localhost:5000/api/student`

Expected response format (values come from your `backend/.env`):

```json
{
  "name": "Your Full Name",
  "studentId": "Your Student ID"
}
```

## 6) End-to-end / database proof (register and login)

After `docker compose up --build`, open the UI at **`http://localhost:3300`** (not port 5000).

1. **Register** a new account (any email, password at least 8 characters, role Volunteer).
   - Success: Activity log shows `Registration successful. Please log in.`
   - `Email already exists` means the API and database are working; use **Login** or a different email.
2. **Log in** with the same credentials.
3. Confirm the **dashboard** loads.

The frontend proxies API requests to the backend, so register/login work in Docker without extra CORS or API URL setup.

## 7) Sensitive configuration and security notes

- Real `.env` files are intentionally excluded from git.
- Only `.env.example` template files are committed.
- No real credentials should be committed to this repository.
- The marker should create `.env` files from `.env.example` and set:
  - `JWT_SECRET`
  - `STUDENT_NAME`
  - `STUDENT_ID`

The app should run without additional hidden steps if these instructions are followed.

## 8) Stop containers

```bash
docker compose down
```

To remove MongoDB volume data as well (clears registered users):

```bash
docker compose down -v
```
