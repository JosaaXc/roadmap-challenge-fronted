# CodeQuest DevTalles Front 🚀

A zoneless, signal-first Angular single-page application built with **Angular 22**, **TailwindCSS v4** and **spartan/ui**, adhering to the modern Angular style guide and strict TypeScript standards.

- **Live demo:** https://codequestdevelop.web.app
- **Backend:** this is the frontend of CodeQuest. Logging in and loading any data need the NestJS API from [roadmap-challenge-backend](https://github.com/JosaaXc/roadmap-challenge-backend) running; see [Getting Started](#-getting-started).

---

## 🏗️ Architecture Overview

The application follows a **feature-sliced** structure. Every feature folder owns its pages, services, models and routes, so it can grow — or be extracted — without touching the rest of the app.

```text
src/
 ├── app/
 │    ├── core/                 # Cross-cutting infrastructure (no UI)
 │    │    ├── auth/            # Session store (signals) + route guards
 │    │    │    ├── session-store.ts        # Single source of truth for the session
 │    │    │    ├── auth-guard.ts           # Protects the authenticated shell
 │    │    │    └── admin-guard.ts          # Restricts the admin subtree
 │    │    └── http/            # Functional HTTP interceptors
 │    │         ├── header-interceptor.ts   # Adds the context headers the API requires
 │    │         ├── auth-interceptor.ts     # Injects the Bearer token
 │    │         └── error-interceptor.ts    # Renews the session on 401, logs out if it can't
 │    │
 │    ├── layouts/              # Route-level shells, each with its own outlet
 │    │    ├── main-layout/     # Authenticated shell (header + navigation)
 │    │    ├── admin-layout/    # Admin panel shell
 │    │    └── auth-layout/     # Public shell for login and registration
 │    │
 │    ├── features/             # One folder per domain owner
 │    │    ├── landing/         # Public landing page and course catalog (/cursos)
 │    │    ├── auth/            # Login, registration and password recovery
 │    │    ├── assessment/      # Onboarding questionnaire
 │    │    ├── paths/           # Learning paths (list and detail)
 │    │    ├── community-paths/ # Paths other users made public
 │    │    └── admin/           # Course catalog management
 │    │         ├── pages/      # Route components
 │    │         ├── services/   # <feature>-api.ts and <feature>-store.ts
 │    │         ├── models/     # Domain and view types
 │    │         ├── constants/  # Static content: hardcoded data and label maps
 │    │         ├── components/ # Section components used by that feature's pages
 │    │         ├── pipes/      # Display transforms shared by that feature's pages
 │    │         ├── utils/      # Pure functions, each tested by its own .spec.ts
 │    │         └── admin.routes.ts         # Lazy route definitions
 │    │
 │    ├── shared/               # Reusable, feature-agnostic pieces
 │    │    ├── ui/             # Presentational components (BrandLogo, ...)
 │    │    ├── icons/          # Raw SVG strings for provideIcons()
 │    │    └── pages/          # Feature-agnostic routes (NotFoundPage)
 │    ├── app.routes.ts         # Root routing table and layout composition
 │    └── app.config.ts         # Application providers
 │
 ├── environments/              # Build-time configuration (fileReplacements)
 └── styles.css                 # Tailwind entry point and design tokens

libs/ui/                        # spartan/ui helm components (owned, not vendored)
```

---

## 🛡️ Core Features & Standards

### 1. Zoneless Change Detection
- The application runs **without `zone.js`**. `provideZonelessChangeDetection()` is registered explicitly in `app.config.ts`.
- All shared state lives in **signals**. Plain fields mutated from async callbacks will not trigger a re-render.
- `OnPush` is the default change detection strategy for every component.

### 2. Signal Stores (`asReadonly` pattern)
State is exposed as read-only signals; mutation happens only through explicit methods on the store:

```ts
@Service()
export class SessionStore {
  private readonly _user = signal<SessionUser | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
}
```

### 3. Lazy Routing with Layout Shells
- Every page is loaded through `loadComponent`; every multi-page feature through `loadChildren` pointing at its own `*.routes.ts`.
- Layouts are parent routes, so the guard is declared **once** on the shell and protects the whole subtree:

| Route | Shell | Guard |
|---|---|---|
| `/` | — | `guestGuard` (signed-in users go to `/mis-rutas`) |
| `/cursos` | — | public |
| `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` | `AuthLayout` | `guestGuard` |
| `/cuestionario` | — | `authGuard` |
| `/mis-rutas`, `/mis-rutas/:id` | `MainLayout` | `authGuard` |
| `/community`, `/community/:id` | `MainLayout` | `authGuard` |
| `/admin`, `/admin/catalog`, `/admin/questions`, `/admin/public-paths` | `AdminLayout` | `authGuard` + `adminGuard` |
| `**` | — | `NotFoundPage` |

### 4. Functional HTTP Interceptors
Registered in order via `provideHttpClient(withInterceptors([...]))`:
- **`headersInterceptor`**: adds the device, app-version and location headers the API requires on every call.
- **`authInterceptor`**: attaches `Authorization: Bearer <token>` when a session exists.
- **`errorInterceptor`**: on a `401`, renews the session with the refresh-token cookie and retries the request; if the renewal fails, it clears the session and redirects to the login page.

### 5. Build-Time Environment Configuration
- `src/environments/environment.ts` (production) and `environment.development.ts` (development), swapped by the CLI through `fileReplacements`.
- Development (`npm start`) calls the local API at `http://localhost:3000/api/v1`; production (`npm run build`) calls the deployed API on Render.
- Both are typed against a shared `AppEnvironment` interface, so a key added to one and forgotten in the other fails the build instead of failing at runtime.

### 6. spartan/ui + TailwindCSS v4
- Helm components are **copied into `libs/ui/`** and owned by this repository; they are imported through the `@spartan-ng/helm/*` path aliases.
- Class composition uses spartan's `hlm()` helper. There is no custom `cn()` utility.
- Design tokens (`--background`, `--primary`, `--radius`, …) are declared in `src/styles.css` for the app's dark theme.

> **Note:** spartan directives are attribute selectors. Angular silently ignores an unknown attribute such as `hlmBtn`, so a component that renders unstyled is almost always a missing entry in the `imports` array — not a Tailwind problem. Prefer the barrels (`HlmCardImports`) to avoid this.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `^22.22.3 || ^24.15.0 || >=26.0.0`
- **npm**: `v11.19.0` (pinned via the `packageManager` field)
- The **CodeQuest API** running locally, as the next step explains

### 1. Start the backend first
Every screen talks to the API, so start it before the frontend. Clone [roadmap-challenge-backend](https://github.com/JosaaXc/roadmap-challenge-backend) and follow its README: environment file, JWT keys, Docker, migrations and seed. It ends with the API at `http://localhost:3000/api/v1`, which is where `environment.development.ts` points.

Its `.env.example` already sets `FRONTEND_URL=http://localhost:4200`, the address of this dev server, so CORS and the login redirects work as they are. Two settings in that backend `.env` need attention:
- **Discord (required to start):** the API refuses to boot while `DISCORD_CLIENT_ID` or `DISCORD_CLIENT_SECRET` is empty, and both come empty in `.env.example`. For Discord login, take them from an application in the [Discord Developer Portal](https://discord.com/developers/applications) with `http://localhost:3000/api/v1/auth/discord/callback` added as a redirect. To try the app with email and password only, any placeholder such as `local` is enough.
- **Admin panel:** uncomment `SEED_ADMIN_PASSWORD` before running `npm run db:seed`, then sign in as `admin@codequest.local` with that password. Without it the admin is created with no password. Any other account can be created from `/auth/register`.

### 2. Install and run the frontend
```bash
npm install

# Development server with hot-reload at http://localhost:4200/
npm start
```

Other scripts:
```bash
# Production build, which calls the deployed API
npm run build

# Development build in watch mode
npm run watch
```

### Running Tests
```bash
# Unit tests with the Vitest runner
npm test

# Single run, no watch mode
npm test -- --watch=false
```

### Deployment
The live demo is served by Firebase Hosting. `firebase.json` publishes the production build and sends every route of the app to `index.html`:
```bash
npm run build
firebase deploy --only hosting
```

---

## 🧱 Scaffolding Conventions

File names carry **no type suffix** (`path-detail.ts`, never `path-detail.component.ts`). The Angular 22 CLI already follows this, so no flags are required:

```bash
# A page inside a feature
ng generate component features/paths/pages/my-paths-page --skip-tests

# Guards and interceptors are functional by default
ng generate guard core/auth/auth --implements=CanActivate --skip-tests
ng generate interceptor core/http/auth --skip-tests
```

Do not pass `--standalone` or `--functional`: both are already the default in Angular 22. Delete the generated `.css` file — component stylesheets are unused in this project, styling goes through Tailwind utilities. Stores, API services and models are written by hand.

---

## 🤝 Contribution & Git Guidelines

For branch naming rules, Conventional Commits standard, and Pull Request workflow, please refer to our [Contributing & Git Workflow Guide](CONTRIBUTING.md).

For AI Assistants and LLMs working on this codebase, refer to [.github/SYSTEM_PROMPT.md](.github/SYSTEM_PROMPT.md).

---

## 📜 License

This project is [MIT licensed](LICENSE).
