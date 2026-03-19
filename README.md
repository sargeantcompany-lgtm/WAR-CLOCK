# WAR CLOCK

Monorepo scaffold for:

- `frontend`: React + Vite + TypeScript + Tailwind CSS
- `backend`: Node.js + Express + TypeScript + Prisma
- `database`: PostgreSQL
- `deployment`: Railway

## Structure

- `frontend/` client application
- `backend/` API service
- `docker-compose.yml` local PostgreSQL for development

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run prisma:migrate -- --name init
npm run seed
npm run dev
```

### Database

```bash
docker compose up -d
```

## Railway notes

- Push this monorepo to GitHub and create two Railway services from the same repo:
  - `backend` service with root directory `backend/`
  - `frontend` service with root directory `frontend/`
- Add a Railway PostgreSQL database and copy its connection string into backend `DATABASE_URL`.
- Backend env vars:
  - `PORT=8080`
  - `DATABASE_URL=<Railway Postgres URL>`
  - `ADMIN_TOKEN=<strong secret>`
  - `CORS_ORIGIN=<frontend Railway domain>`
- Frontend env vars:
  - `VITE_API_BASE_URL=<backend Railway domain>/api`
- Railway will assign public `*.up.railway.app` domains to both services, and you can attach a custom domain later if needed.

## GitHub push

```bash
git init
git branch -M main
git remote add origin https://github.com/sargeantcompany-lgtm/WAR-CLOCK.git
git add .
git commit -m "Initial WAR CLOCK monorepo"
git push -u origin main
```
