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

---

## Day 3 — 02 April 2026

### What we built
- Installed and configured Prisma ORM
- Designed full database schema — User, ChefProfile, ProcessPost, Order, LiveSession
- Ran first migration and read every line of generated SQL
- Connected Prisma Client to SQLite database
- Verified database connection through /health endpoint

### The battle — Prisma 7 vs Prisma 5
We initially installed Prisma 7 (latest) and hit multiple breaking changes:

Problem 1 — Prisma 7 moved DATABASE_URL out of schema.prisma into prisma.config.ts
Fix — removed url from datasource block in schema.prisma

Problem 2 — Prisma 7 new generator (prisma-client) outputs TypeScript files only
Fix — changed generator provider from "prisma-client" to "prisma-client-js"

Problem 3 — Prisma 7 engine type "client" requires adapter or accelerateUrl
This means Prisma 7 no longer supports direct SQLite connection in CommonJS
Fix — downgraded to Prisma 5 which is stable, widely used, and works perfectly with SQLite + CommonJS + Node.js

Lesson — newest version is not always the right version. Prisma 7 is designed for TypeScript-first projects with edge adapters. Prisma 5 is the right choice for our Node.js + SQLite + CommonJS stack.

### Database schema designed — 5 tables

User — stores all users. role field handles CUSTOMER, CHEF, ADMIN
ChefProfile — extra data for chef users. 1:1 with User
ProcessPost — chef's cooking process posts. Many customers can order one post
Order — created when customer orders a post. Links customer to post
LiveSession — created after an order. Chef goes live for that specific customer. 1:1 with Order

### Key SQL concepts learned from migration file
- PRIMARY KEY AUTOINCREMENT — database assigns id automatically
- NOT NULL — field is required, cannot be empty
- DEFAULT value — used when field not provided
- FOREIGN KEY — links one table to another
- ON DELETE RESTRICT — blocks deletion if related records exist
- ON UPDATE CASCADE — automatically updates linked records
- UNIQUE INDEX — enforces uniqueness AND speeds up lookups

### Key Prisma concepts learned
- schema.prisma — defines your tables in readable language
- prisma migrate dev — reads schema, generates SQL, applies it to database
- migration.sql — the actual SQL Prisma generated, always readable
- npx prisma generate — generates the PrismaClient runtime code
- PrismaClient singleton — create once, reuse everywhere. Multiple instances = connection overload
- @prisma/client — the runtime package your app uses
- prisma (devDependency) — the CLI tool for migrations and generation

### Singleton pattern
Created server/config/prisma.js that creates one PrismaClient instance
and exports it. Every file that needs the database imports this one instance.
This prevents connection pool exhaustion under load.

### Correct file structure for Prisma 5 + SQLite
- DATABASE_URL in .env as: file:./dev.db
- url = env("DATABASE_URL") in schema.prisma datasource block
- require('dotenv').config() at the very top of index.js before any other require
- PrismaClient imported from '@prisma/client' with no constructor arguments
- npx prisma generate must be run after any schema change

### Commands learned
- npx prisma init --datasource-provider sqlite — initialise Prisma
- npx prisma migrate dev --name <name> — create and apply migration
- npx prisma generate — generate/regenerate Prisma Client
- npm uninstall / npm install — downgrade packages when needed

### What the /health endpoint now does
Pings the database with SELECT 1 — the simplest possible query
Returns database: connected if successful
Returns database: disconnected with error reason if not
This is standard practice in real production APIs

### Decisions made
- Prisma 5 over Prisma 7 — stability over latest for learning project
- SQLite for development — single file database, zero configuration
- dotenv loaded first in index.js — ensures env vars available before PrismaClient
- CommonJS (require) not ESM (import) — standard for Node.js backends