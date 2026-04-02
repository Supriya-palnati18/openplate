# Dev Log — OpenPlate

A living document of every decision made, every problem solved, and every concept learned while building this project.

---

## Day 1 — 01 April 2026

### What we set up
- Initialised Git repository locally
- Created project folder structure
- Connected to personal GitHub using PAT for security
- Renamed default branch from `master` to `main`

### Decisions made
- Chose React + Vite over Next.js — we want full control and clear separation between frontend and backend. Next.js does too much magic early on.
- Chose SQLite to start — simpler setup, same SQL knowledge applies, migrate to PostgreSQL when deploying.
- Chose to keep client/ and server/ as separate folders — clear separation of concerns, mirrors how real product teams structure projects.

### What I learned today
- `git init` creates a hidden `.git` folder — that folder IS the repository
- A branch doesn't exist in Git until the first commit is made
- Node.js doesn't need virtual environments like Python because npm installs packages locally inside `node_modules/` by default
- Global Git identity controls your name/email. The remote URL controls WHERE code is pushed.
- PAT embedded in remote URL guarantees the correct GitHub account is used on shared machines
- Common types used in real teams:
    init — project setup
    feat — new feature added
    fix — bug fixed
    refactor — code restructured, no behaviour change
    docs — documentation only
    chore — maintenance, config changes
---
## Day 2 — 02 April 2026

### What we built
- Created client/ using React + Vite
- Created server/ with Node.js + Express from scratch
- Built first API endpoint — GET /health
- Created full folder structure: routes, controllers, middleware, models, config
- Set up .env for environment variables
- Verified .gitignore protecting node_modules and .env

### Commands learned
- `npm create vite@latest client -- --template react` — scaffold React app
- `npm init -y` — initialise a Node project
- `npm install express` — install a package as dependency
- `npm install -D nodemon dotenv` — install as dev dependency
- `npm run dev` — run nodemon server
- `git add .` — stage all untracked files

### Concepts learned
- Node.js doesn't need virtual environments — npm installs locally by default
- Two separate package.json files — client and server are independent projects
- MVC pattern — routes, controllers, models separation
- .env files store secrets — never committed to Git
- Empty folders are invisible to Git — need a file inside to track
- nodemon watches files and restarts server automatically on save
- express.json() middleware needed to parse incoming request bodies
- Health check endpoint — standard practice in every real API

### Decisions made
- Kept client and server completely separate — clear boundary, mirrors real teams
- Used require() not import — standard CommonJS for Node.js backend
- PORT defaults to 5000 locally, reads from environment in production