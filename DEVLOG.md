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

---