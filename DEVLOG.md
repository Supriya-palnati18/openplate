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

---

## Day 4 — 02 April 2026

### What we built
- Complete auth system — register, login, logout
- Password hashing with bcryptjs
- JWT token creation with jsonwebtoken
- HttpOnly cookie for secure token storage
- cookie-parser middleware wired into Express
- Auth routes mounted at /api/auth

### Endpoints built
- POST /api/auth/register — validates input, checks duplicate email, hashes password, saves user
- POST /api/auth/login — verifies password, creates JWT, sets HttpOnly cookie
- POST /api/auth/logout — clears the cookie

### Packages installed
- bcryptjs — pure JS password hashing, works on all platforms
- jsonwebtoken — creates and verifies JWT tokens
- cookie-parser — lets Express read cookies from incoming requests

### Key decisions made
- bcryptjs over bcrypt — no native compilation needed, works on Windows
- HttpOnly cookie over localStorage — JavaScript cannot read it, prevents XST attacks
- Same error message for wrong email and wrong password — prevents user enumeration
- JWT payload contains id, email, role — everything middleware needs without a DB call
- secure: true only in production — allows http://localhost in development
- maxAge matches JWT expiresIn — both 7 days, always keep in sync

### Bugs fixed
- bcrypt vs bcryptjs — module name matters exactly
- Table not found — had to re-run migration after switching Prisma versions

### What I learned
- async/await — await pauses the function not the server, Node handles other requests meanwhile
- bcrypt salt — random string added to password before hashing, stored inside hash itself
- cost factor 10 — 1024 rounds, intentionally slow to defeat brute force
- JWT — signed ID card, three parts: header.payload.signature
- stateless auth — server stores nothing, token carries everything
- HttpOnly cookie — browser handles it, JavaScript cannot touch it
- sameSite strict — blocks CSRF attacks from other domains
- MVC in action — routes file only maps URLs, controller has all the logic

### How to test auth
- POST /api/auth/register with { name, email, password, role }
- POST /api/auth/login with { email, password }
- POST /api/auth/logout — no body needed
- Use Thunder Client in VS Code to test all endpoints
- Use npx prisma studio to view database records visually

---

## Day 5 — 06 April 2026

### What we built
- Auth middleware — protect and restrictTo functions
- GET /api/auth/me — returns current logged in user
- Role-based access control (RBAC) working

### How middleware works
- Sits between request and controller
- Reads JWT from HttpOnly cookie via req.cookies.token
- Verifies token with jwt.verify() using JWT_SECRET
- If valid — attaches decoded user to req.user — passes to controller
- If invalid/missing — returns 401 immediately, controller never runs

### Two middleware functions built
- protect — checks if user is logged in
- restrictTo(...roles) — checks if user has required role

### How to protect any route
- router.get('/route', protect, controller) — login required
- router.get('/route', protect, restrictTo('ADMIN'), controller) — admin only
- router.get('/route', protect, restrictTo('ADMIN', 'CHEF'), controller) — either role

### Status codes learned
- 401 Unauthorized — not logged in, no token
- 403 Forbidden — logged in but wrong role
- Frontend handles these differently — 401 redirects to login, 403 shows access denied

### What req.user contains after middleware
- id, email, role — everything decoded from JWT
- No database call needed — token carries everything
- Controllers access req.user.id, req.user.role directly

### Prisma select
- select: { id: true, name: true } — returns only specified fields
- Excludes password automatically — safer than manually removing it
- Always use select when returning user data to client

### process.env explained
- process is Node's global object — always available, never imported
- process.env holds all environment variables
- require('dotenv').config() loads .env into process.env
- Must be first line in index.js — before any other require
- In production — platform sets env vars directly, no .env file needed

---

## Day 6 — 07 April 2026

### What we built
- Chef Profile API — create, get own, get by id, update
- Four endpoints following REST conventions
- Role automatically upgraded from CUSTOMER to CHEF on profile creation

### Endpoints built
- POST /api/chef/profile — create chef profile (protected)
- GET /api/chef/profile — get own profile (protected)
- GET /api/chef/:id — get any chef's public profile (public)
- PUT /api/chef/profile — partial update profile (protected)

### Key concepts learned

#### req.params vs req.body vs req.user
- req.params — values from URL like /:id — always strings, use parseInt()
- req.body — values from JSON request body — correct types preserved
- req.user — values decoded from JWT by middleware — correct types preserved

#### Prisma include
- include: { user: { select: {...} } } — joins related table in one query
- Avoids N+1 queries — one database call instead of two
- select inside include — controls which fields from related table to return

#### Conditional spread for partial updates
- ...(value && { key: value }) — only adds field if value exists
- Prevents accidentally wiping existing data with undefined
- Clean pattern for PATCH/PUT endpoints

#### Public vs protected routes — product decision
- Ask: does the server need to know WHO is making this request?
- Yes → protect middleware required
- No → public route, no middleware
- Even public routes limit exposed data — never return email or sensitive fields

#### Two database operations in one controller
- prisma.user.update — upgrade role to CHEF
- prisma.chefProfile.create — create profile
- Both in same function, keeping user experience simple

### Commands used
- npx prisma studio — visual database viewer, always run from server/ folder
- Cookie header workaround — token=value when Thunder Client free doesn't persist cookies


---

## Day 7 — 10 April 2026

### What we built
- Process Posts API — full CRUD plus publish/unpublish
- Six endpoints covering complete post lifecycle
- Ownership checks on update, delete, publish

### Endpoints built
- GET  /api/posts          — browse all published posts (public)
- GET  /api/posts/:id      — view single post with full chef details (public)
- POST /api/posts          — create post (CHEF only)
- PUT  /api/posts/:id      — update own post (CHEF only)
- DELETE /api/posts/:id    — delete own post (CHEF only)
- PATCH /api/posts/:id/publish — toggle publish/unpublish (CHEF only)

### Key concepts learned

#### Resource ownership check
- Always fetch the resource first, then compare authorId with req.user.id
- Return 403 if they don't match — cannot edit someone else's content
- This pattern applies to any user-owned resource

#### Draft vs published system
- isPublished: false = draft, only visible to chef
- isPublished: true = live, visible to all customers
- togglePublish uses !post.isPublished to flip the boolean
- getAllPosts filters where: { isPublished: true } — drafts never leak

#### Different data per endpoint
- getAllPosts — minimal data, fast loading for feed
- getPostById — full data including chef bio and isVerified
- Return only what each view needs — no more, no less

#### Prisma findMany options
- where — filter records
- include — join related tables
- orderBy — sort results, desc = newest first
- select inside include — control fields from joined table

#### Why imageUrl is optional
- Schema has String? — nullable field
- Not required for post to make sense
- Video/image upload is a separate feature — Cloudinary + Multer
- Database stores URL string either way

#### restrictTo on write operations
- GET routes — public, no auth needed
- POST/PUT/DELETE/PATCH — protect + restrictTo('CHEF')
- Customers cannot create posts even if logged in
- Double protection — must be authenticated AND correct rolegit add DEVLOG.md

---

## Day 8 — 11 April 2026

### What we built
- Orders API — complete order lifecycle
- Live Session API — session management
- Price field added to ProcessPost
- paymentStatus and amount fields added to Order
- Complete end to end flow tested

### Endpoints built

#### Orders
- POST /api/orders — customer places order (CUSTOMER only)
- GET /api/orders/my — customer sees their orders
- GET /api/orders/chef — chef sees received orders (CHEF only)
- PATCH /api/orders/:id/confirm — chef confirms → LiveSession auto-created
- PATCH /api/orders/:id/cancel — both chef or customer can cancel

#### Live Sessions
- GET /api/sessions/:id — get session details (chef or customer only)
- PATCH /api/sessions/:id/start — chef goes live, startedAt recorded
- PATCH /api/sessions/:id/end — chef ends, endedAt recorded, order COMPLETED

### Complete flow tested
Customer orders → Chef confirms (LiveSession created) → 
Chef starts session (LIVE) → Chef ends session (ENDED + Order COMPLETED)

### Key concepts learned

#### Two operations in one endpoint
- confirmOrder: updates order status AND creates LiveSession atomically
- endSession: updates session AND completes order in same request
- Keeps data consistent — impossible to have confirmed order without a session

#### Flexible ownership
- cancelOrder — both chef AND customer can cancel
- isCustomer = order.customerId === req.user.id
- isChef = chefProfile && order.post.chefId === chefProfile.id
- if (!isCustomer && !isChef) → 403

#### Status guards
- Always check current status before changing it
- Cannot confirm already confirmed order
- Cannot start already live session
- Cannot end session that isn't live
- Prevents invalid state transitions

#### Price capture at order time
- amount: post.price captured when order is created
- Even if chef changes price later — existing orders keep original price
- Same pattern used by every e-commerce platform

#### SQLite migration strategy
- Adding columns creates new table, copies data, drops old, renames new
- PRAGMA foreign_keys=OFF during restructure
- INSERT INTO ... SELECT FROM preserves all existing rows
- New columns get DEFAULT values for existing rows automatically

### Planned next
- Connect React frontend to backend
- Phase 3 — forgot password + OTP email
- Phase 4 — Razorpay payment integration
- Video streaming — WebRTC or Agora for actual live video

---

## Day 9 — 11 April 2026

### What we built
- Complete React frontend foundation
- Design system with CSS variables — light and dark theme
- Reusable Button and Input components with CSS Modules
- Navbar with logo, theme toggle, auth state
- Login page — connects to real backend
- Register page — role selector, auto-login after register
- Service layer — all API calls centralised
- Theme context and Auth context

### Design system decisions
- CSS variables in :root — change one value, entire app updates
- [data-theme='dark'] — dark mode via single attribute on html element
- CSS Modules — scoped styles, no conflicts between components
- All spacing, colors, shadows, radius as variables — consistent everywhere

### Service layer pattern
- All API calls in services/ folder — never call axios directly in components
- One function per endpoint — login(), register(), getMe() etc.
- If endpoint changes — fix one line in service file only
- Components stay clean — they call functions, not HTTP methods

### How frontend talks to backend
- axios sends HTTP request with JSON body
- Content-Type: application/json set automatically by axios
- Vite proxy forwards /api/* requests to localhost:5000
- express.json() middleware parses JSON body into req.body
- withCredentials: true sends cookies automatically on every request

### Key React concepts used
- useState — stores form data, error, loading state
- useContext — reads theme and auth from context without prop drilling
- useNavigate — programmatic navigation after login/register
- e.preventDefault() — stops browser default form submit behaviour
- [e.target.name] — dynamic key, one handleChange handles all inputs

### Role based redirect after login
- CHEF → /chef/dashboard
- CUSTOMER → /feed
- ADMIN → /admin (planned)

### Files created
- src/index.css — design tokens (CSS variables)
- src/context/ThemeContext.jsx — theme state, toggle, localStorage persistence
- src/context/AuthContext.jsx — user state, login, logout
- src/services/api.js — axios instance with baseURL and withCredentials
- src/services/authService.js — register, login, logout, getMe
- src/services/chefService.js — chef profile API calls
- src/services/postService.js — process posts API calls
- src/services/orderService.js — orders API calls
- src/services/sessionService.js — live session API calls
- src/components/ui/Button.jsx + Button.module.css
- src/components/ui/Input.jsx + Input.module.css
- src/components/layout/Navbar.jsx + Navbar.module.css
- src/pages/auth/LoginPage.jsx + LoginPage.module.css
- src/pages/auth/RegisterPage.jsx + RegisterPage.module.css


---

## Day 10 — 13 April 2026

### What we built
- Sidebar navigation for desktop
- Bottom navigation for mobile
- Profile dropdown in Navbar
- AppLayout — wrapper combining sidebar + bottom nav
- Post Detail Page — view dish, ingredients, steps, order
- My Orders Page — customer order history with cancel
- Chef Profile Setup — first page after chef registers
- Fixed dashboard stats to show per-chef data only

### Architecture decisions

#### Layout pattern — PublicLayout vs PrivateLayout
- Public routes (login, register, home) — no sidebar, no bottom nav
- Private routes — wrapped in AppLayout which adds sidebar + bottom nav
- AppLayout uses children prop — doesn't know or care what page is inside it

#### Responsive navigation
- Desktop (> 768px) — left sidebar, 240px wide, fixed position
- Mobile (< 768px) — bottom nav, 64px tall, fixed at bottom
- Same links array, same NavLink pattern — only CSS changes between them
- padding-bottom: 80px on mobile main content — prevents content hiding behind bottom nav
- margin-left: 240px on desktop main — pushes content right of fixed sidebar

#### Semantic HTML
- aside — sidebar (supplementary navigation beside main content)
- nav — bottom navigation (primary navigation links)
- main — page content area

#### NavLink vs Link
- Link — basic navigation, no active state awareness
- NavLink — gives isActive boolean, used to highlight current page in nav

#### useParams hook
- Reads dynamic URL segments like :id in /posts/:id
- Returns string always — must parseInt() before using as number
- useEffect depends on [id] — refetches if URL id changes

#### Click outside detection pattern
- useRef points to the dropdown DOM element
- document.addEventListener('mousedown', handler) on mount
- cleanup with removeEventListener on unmount
- checks if click target is inside ref element — if not, close dropdown

#### Profile setup flow
- Chef registers → redirected to /chef/profile/setup
- Setup page calls getMyProfile on load
- If profile exists → redirect to dashboard (replace: true)
- If no profile → show form
- After submit → redirect to dashboard
- replace: true prevents Back button returning to setup page

### Key React concepts learned

#### useParams
- Hook from react-router-dom
- const { id } = useParams() reads :id from URL
- Always returns string — convert to number with parseInt()

#### navigate(-1)
- Goes back one step in browser history
- Like pressing browser Back button programmatically

#### useRef
- Points to actual DOM element
- Does not cause re-render when value changes
- Used for click outside detection, focusing inputs, storing timers

#### position: sticky on order card
- Sticks to bottom of viewport as user scrolls
- Always visible without blocking content above it
- bottom: 80px on mobile to stay above bottom nav

#### white-space: pre-wrap
- Preserves line breaks exactly as typed
- Used for ingredients and steps text

#### Lookup object for CSS classes
- const map = { PENDING: styles.pending, ... }
- map[status] returns correct class
- Cleaner than multiple if/else or ternary chains

#### Promise.all
- Runs multiple API calls simultaneously
- Returns array of results in same order
- Faster than sequential awaits — parallel not serial

### Bugs fixed
- navigate not defined in CustomerFeed — missing useNavigate import and hook call
- Dashboard showing all chefs' posts in stats — fixed to use getMyProfile instead of getAllPosts
- CSS pasted into wrong files — always check filename tab before pasting

### File structure added
- components/layout/AppLayout.jsx + css
- components/layout/Sidebar.jsx + css
- components/layout/BottomNav.jsx + css
- pages/posts/PostDetailPage.jsx + css
- pages/customer/MyOrdersPage.jsx + css
- pages/chef/ChefProfileSetup.jsx + css


---

## Day 11 — 22 April 2026

### What we built
- Refined Home page UI — hero section, feature highlights, cleaner layout
- Redesigned Register page — improved form layout and visual hierarchy
- Consistent visual language across public pages

### Decisions made
- Public-facing pages (Home, Login, Register) should feel polished — first impression matters
- Register page uses role selector clearly — CUSTOMER vs CHEF choice is a product moment, not just a form field

---

## Day 12 — 25 April 2026

### What we built
- Shared AuthLayout component — wraps Login and Register pages
- Eliminates duplicated card/centering CSS between auth pages
- Single source of truth for the auth page shell

### Key concept — shared layout component
- Instead of copying the same card styles into LoginPage.module.css and RegisterPage.module.css, a single AuthLayout handles centering, card, background
- Each page only owns its form content — not its container
- Same principle as AppLayout for protected pages — separate layout concerns from content concerns

### Decisions made
- AuthLayout vs CSS copy-paste — layout is a structural concern, not a page concern
- One change to AuthLayout updates both Login and Register consistently

---

## Day 13 — 26 April 2026

### What we built
- Chef Dashboard redesigned — removed tabs, made Orders a separate sidebar page
- ChefOrdersPage — dedicated orders page with full order management
- Chef Profile Setup overhauled — now handles create, view, and edit in one page
- Add Dish flow changed from inline expand to modal overlay
- Navbar logo bug fixed — dual logo strategy for desktop vs mobile
- Sidebar and BottomNav updated — two separate chef links (My Menu, Orders)

### Chef navigation architecture change
Previously My Menu and Orders were tabs inside one dashboard page.
Now:
- /chef/dashboard → My Menu page only (posts management)
- /chef/orders → Dedicated Orders page with stat cards
- Two links in Sidebar and BottomNav
- Cleaner separation — each page has one responsibility

### ChefOrdersPage — what it shows
- Three stat cards: Total Orders, Pending (orange), Delivered/Completed (green)
- Orders grid — one card per order
- Order card: dish name, status badge, type (live/video), customer name, price
- Actions based on status:
  - PENDING → Confirm / Cancel buttons
  - CONFIRMED → Go Live / End session buttons
  - COMPLETED / CANCELLED → read-only label
- Skeleton loading, empty state, error state with retry

### Chef Profile Setup — overhaul
Old behaviour — only showed create form, redirected away if profile existed.
New behaviour:
- On load: tries to fetch existing profile
  - If found → shows profile in view mode with Edit button
  - If not found → shows create form directly (isNewProfile = true)
- Edit mode: same form fields, saves via create or update based on isNewProfile flag
- Skip for now button — only shown when isNewProfile is true
  - Lets new chef bypass profile setup and go to dashboard
  - Can always come back and fill it later
- Wrapped inside AppLayout — sidebar visible on this page
- Navbar Profile link routes CHEF to /chef/profile/setup

### Add Dish modal pattern
- Previously form expanded inline below the Add Dish button
- Now opens as full overlay modal
- Modal has sticky header with title and × close button
- Clicking outside modal backdrop closes it
- CreatePostForm rendered inside modal with showTitle={false} prop
- Cleaner UX — form doesn't disrupt the dish list layout

### Navbar logo bug — root cause and fix
The logo appeared huge because CSS classes .logoDesktop and .logoMobile were removed in an earlier refactor but the JSX still referenced them.
Fix:
- .logoDesktop → height: 46px, display: block (visible on desktop)
- .logoMobile → display: none on desktop, display: block on mobile
- Mobile shows theme-aware icon, desktop shows full Laptop-logo.png
- Media query at 768px swaps visibility

### Key concept — isNewProfile flag
A single flag controls which API to call on save:
- isNewProfile = true → POST /api/chef/profile (create)
- isNewProfile = false → PUT /api/chef/profile (update)
This avoids two separate pages or components for the same form.
Same pattern will be reused on the customer profile page.

### Files created
- pages/chef/ChefOrdersPage.jsx + css
- Tabler icons used: IconShoppingBag, IconClock, IconCircleCheck, IconChefHat, IconClipboardList

### Files modified
- pages/chef/ChefDashboard.jsx — removed tabs, orders section moved out
- pages/chef/ChefProfileSetup.jsx — full overhaul with view/edit/create + skip
- pages/chef/sections/PostsSection.jsx — add dish as modal
- pages/chef/sections/PostsSection.module.css — modal overlay styles
- components/layout/Sidebar.jsx — two chef links
- components/layout/BottomNav.jsx — two chef links
- components/layout/Navbar.jsx — logo fix, role-aware profile link
- components/layout/Navbar.module.css — .logoDesktop and .logoMobile classes
- App.jsx — /chef/orders route added, ChefProfileSetup wrapped in AppLayout

---

## Day 14 — 27 April 2026

### What we built
- Customer Profile — full backend and frontend
- CustomerProfile database model with delivery address fields
- Three API endpoints for customer profile management
- CustomerProfilePage — view and edit delivery details with sidebar

### Why customer profile
Customers need to store a delivery address before ordering food.
Fields needed: phone, street, landmark (optional), city, state, country, pincode.
These are captured once and reused for every order.
Name and email already exist on the User model — no duplication needed.

### Database change — CustomerProfile model
New table added to schema.prisma:
- userId — unique foreign key to User (1:1 relationship)
- phone — required
- landmark — optional (String?)
- street, city, state, country, pincode — all required
- createdAt, updatedAt — automatic timestamps
- Relation added on User model: customerProfile CustomerProfile?

Migration command: npx prisma migrate dev --name add_customer_profile

### API endpoints — /api/customer
- POST /api/customer/profile — create profile (first time)
- GET /api/customer/profile — fetch own profile
- PUT /api/customer/profile — update profile

All three routes protected with JWT middleware.
Controller uses conditional spread for partial updates — same pattern as chef profile.
GET returns 404 if no profile exists — frontend uses this to detect new vs existing user.

### CustomerProfilePage — design decisions
- Page lives inside AppLayout — sidebar is visible (consistent with rest of app)
- Two sections on the page:
  - Account Info card — Name, Email, Role (read-only, from AuthContext)
  - Delivery Details card — editable fields
- Same isNewProfile pattern as Chef Profile Setup:
  - 404 from API → isNewProfile = true → show form in create mode
  - Profile found → show view mode with Edit button
- Two-column grid for address fields (Street + Landmark, City + State, Country + Pincode)
- Cancel button only shown when editing an existing profile — not when creating first time
- Required fields marked with * in label

### Navbar profile routing — role-aware
- CHEF → navigate to /chef/profile/setup
- CUSTOMER → navigate to /profile
- Single line: navigate(user?.role === 'CHEF' ? '/chef/profile/setup' : '/profile')

### Key concept — 404 as feature
The GET /api/customer/profile endpoint returns 404 when no profile exists.
The frontend catches this error and sets isNewProfile = true.
This is intentional — 404 means "resource does not exist yet" which is semantically correct.
No need for a separate "check if profile exists" endpoint.

### Files created
- server/controllers/customerController.js
- server/routes/customer.js
- client/src/services/customerService.js
- client/src/pages/customer/CustomerProfilePage.jsx
- client/src/pages/customer/CustomerProfilePage.module.css

### Files modified
- server/prisma/schema.prisma — CustomerProfile model + User relation
- server/index.js — customer route registered at /api/customer
- client/src/App.jsx — /profile route added
- client/src/components/layout/Navbar.jsx — role-aware profile navigation