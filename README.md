# Internship Management System

Full-stack web application for managing internship programs: interns, projects, tasks, daily work logs, submissions, feedback, reports, and notifications.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router, Tailwind CSS 4, Axios, Recharts, Lucide |
| Backend | Java 21, Spring Boot 4, Spring Security, JWT |
| Database | MongoDB (Atlas or local) |

---

## Features

### Admin
- Dashboard with stats, recent activity, quick actions, upcoming deadlines
- Intern CRUD and login account provisioning
- Projects and task management (assign, priorities, statuses)
- Review daily work logs and submissions
- Feedback inbox
- Reports & analytics (charts, date range filter, CSV export)
- Notifications (new submissions / work logs)

### Intern
- Personal dashboard (tasks, deadlines, notifications)
- My Tasks
- Submit and view daily work logs
- Submit work (repo / docs / notes) and track review status
- Feedback and notifications (task assigned, deadlines, approvals, revisions)

### Shared
- JWT authentication (`ADMIN` / `INTERN`)
- Role-based routes and API access

---

## Project structure

```
Internship-Management-System/
├── backend/                 # Spring Boot API
│   ├── .env.example
│   ├── pom.xml
│   └── src/main/java/com/internship/backend/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── model/
│       ├── dto/
│       ├── security/
│       └── config/
└── frontend/                # React (Vite) SPA
    ├── package.json
    └── src/
        ├── pages/           # admin + intern pages
        ├── components/
        ├── services/        # API clients
        ├── context/
        └── lib/
```

---

## Prerequisites

- **Java 21+**
- **Maven 3.9+** (or use the Maven wrapper if present)
- **Node.js 20+** and npm
- **MongoDB** connection string (Atlas recommended)

---

## Setup

### 1. Backend environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
spring.mongodb.uri=mongodb+srv://USER:PASS@CLUSTER.mongodb.net/internship_db?retryWrites=true&w=majority

app.jwt.secret=REPLACE_WITH_A_LONG_RANDOM_STRING_AT_LEAST_32_CHARS
app.jwt.expiration=3600000

app.seed.admin.name=System Admin
app.seed.admin.email=admin@example.com
app.seed.admin.password=YourStrongPassword
```

On first startup, the app seeds the admin user from these values if it does not already exist.

### 2. Frontend environment (optional)

By default the frontend calls `http://localhost:8080`.

To override, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

---

## Run locally

### Backend

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`

---

## Default login

Use the admin credentials from your `.env` (`app.seed.admin.email` / `app.seed.admin.password`).

Intern accounts are created when an admin adds an intern (email + password are set by the admin).

---

## Main API areas

| Prefix | Access | Purpose |
|--------|--------|---------|
| `/api/auth/**` | Public | Login |
| `/api/interns/**` | ADMIN | Intern management |
| `/api/projects/**` | ADMIN | Projects |
| `/api/tasks/**` | Authenticated | Tasks (`/me` for interns) |
| `/api/work-logs/**` | Authenticated | Daily work logs |
| `/api/submissions/**` | Authenticated | Work submissions |
| `/api/notifications/**` | Authenticated | In-app notifications |
| `/api/reports/**` | ADMIN | Analytics summary |
| `/api/dashboard/**` | Role-scoped | Admin `/summary`, Intern `/me` |

---

## Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

### Backend

| Command | Description |
|---------|-------------|
| `mvn spring-boot:run` | Run API |
| `mvn test` | Run tests |

---

## Notes

- After changing Java sources, **restart** `mvn spring-boot:run` so new classes load.
- JWT expiry defaults to 1 hour (`app.jwt.expiration` in ms). Log in again if APIs start returning 401.
- Deadline reminders run on a daily schedule (09:00 server time).
- CORS allows `http://localhost:5173` for local development.

---

## License

Academic / internal project use. Update this section if you publish or redistribute the code.
