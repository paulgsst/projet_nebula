# Projet Nebula - Power Consumption Monitor

IoT-based power consumption monitoring system with real-time dashboard.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: AdonisJS (Node.js)
- **Database**: PostgreSQL
- **Infra**: Docker Compose

## Configuration

Before running the project, you need to create two `.env` files:

**1. `.env` at the project root** (used by Docker Compose):
```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=adonis
```

**2. `backend/.env`** (used by AdonisJS):
```env
TZ=UTC
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=your-app-key-here
NODE_ENV=development
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=adonis
```

> `DB_HOST` should be `postgres` when using Docker, or `localhost` if running without Docker.

## Quick Start

### With Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3333


## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/zones` | List all zones with equipment |
| GET | `/zones/:id` | Get a zone by ID |
| GET | `/equipments` | List all equipment |
| GET | `/equipments/:id` | Get equipment by ID |
| PATCH | `/equipments/:id/toggle` | Toggle equipment active state |
| GET | `/power-readings` | Historical consumption data |
