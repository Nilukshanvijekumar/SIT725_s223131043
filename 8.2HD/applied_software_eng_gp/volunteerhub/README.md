# VolunteerHub - Dockerized End-to-End Deployment (SIT725 8.2HD)

This is my individual Dockerised submission for the VolunteerHub group project.
It runs as a full stack Docker deployment with `frontend`, `backend`, and `mongo`.

## 1) Prerequisites

- Docker Desktop installed and running
- Git installed

## 2) Required setup before first run

Run these commands from the `volunteerhub` directory.

PowerShell (Windows):

```powershell
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Bash/macOS/Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env` with your own values:
- `JWT_SECRET` (strong random secret)
- `STUDENT_NAME`
- `STUDENT_ID`

Keep `MONGO_URI` as Docker default:
- `MONGO_URI=mongodb://mongo:27017/volunteerhub`

## 3) Build and start the containerized application

```bash
docker compose up --build
```

## 4) Localhost ports used by this application

- Frontend: `http://localhost:3300`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

## 5) Required HD endpoint verification

Open:
- `http://localhost:5000/api/student`

Expected response format:

```json
{
  "name": "Nilukshan Vijekumar",
  "studentId": "s223131043"
}
```

## 6) End-to-end/database proof completed

I validated register/login through the UI after startup to confirm database-backed functionality is working.

## 7) Sensitive configuration and security notes

- Real `.env` files are intentionally excluded from git.
- Only `.env.example` template files are committed.
- No real credentials should be committed to this repository.
- Marker should create `.env` files from `.env.example` and provide values for:
  - `JWT_SECRET`
  - `STUDENT_NAME`
  - `STUDENT_ID`

The app should run without additional hidden steps if README instructions are followed exactly.

## 8) Stop containers

```bash
docker compose down
```

To remove MongoDB volume data too:

```bash
docker compose down -v
```