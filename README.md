# CodeQuest DevTalles Front 🚀

A zoneless, signal-first Angular single-page application built with **Angular 22**, **TailwindCSS v4** and **spartan/ui**, adhering to the modern Angular style guide and strict TypeScript standards.

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
 │    │         ├── auth-interceptor.ts     # Injects the Bearer token
 │    │         └── error-interceptor.ts    # Clears session and redirects on 401
 │    │
 │    ├── layouts/              # Route-level shells, each with its own outlet
 │    │    ├── main-layout/     # Authenticated shell (header + navigation)
 │    │    └── auth-layout/     # Public shell for login and registration
 │    │
 │    ├── features/             # One folder per domain owner
 │    │    ├── landing/         # Public landing page
 │    │    ├── auth/            # Login and registration
 │    │    ├── assessment/      # Onboarding questionnaire
 │    │    ├── paths/           # Learning paths (list and detail)
 │    │    └── admin/           # Course catalog management
 │    │         ├── pages/      # Route components
 │    │         ├── services/   # <feature>-api.ts and <feature>-store.ts
 │    │         ├── models/     # Domain types
 │    │         └── admin.routes.ts         # Lazy route definitions
 │    │
 │    ├── shared/               # Reusable, feature-agnostic pieces
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
| `/` | — | public |
| `/auth/login`, `/auth/registro` | `AuthLayout` | public |
| `/mis-rutas`, `/mis-rutas/:id` | `MainLayout` | `authGuard` |
| `/cuestionario` | `MainLayout` | `authGuard` |
| `/admin` | `MainLayout` | `authGuard` + `adminGuard` |
| `**` | — | `NotFoundPage` |

### 4. Functional HTTP Interceptors
Registered in order via `provideHttpClient(withInterceptors([...]))`:
- **`authInterceptor`**: attaches `Authorization: Bearer <token>` when a session exists.
- **`errorInterceptor`**: clears the session and redirects to the login page on `401`, then rethrows.

### 5. Build-Time Environment Configuration
- `src/environments/environment.ts` (production) and `environment.development.ts` (development), swapped by the CLI through `fileReplacements`.
- Both are typed against a shared `AppEnvironment` interface, so a key added to one and forgotten in the other fails the build instead of failing at runtime.

### 6. spartan/ui + TailwindCSS v4
- Helm components are **copied into `libs/ui/`** and owned by this repository; they are imported through the `@spartan-ng/helm/*` path aliases.
- Class composition uses spartan's `hlm()` helper. There is no custom `cn()` utility.
- Design tokens (`--background`, `--primary`, `--radius`, …) are declared in `src/styles.css` for both light and dark schemes.

> **Note:** spartan directives are attribute selectors. Angular silently ignores an unknown attribute such as `hlmBtn`, so a component that renders unstyled is almost always a missing entry in the `imports` array — not a Tailwind problem. Prefer the barrels (`HlmCardImports`) to avoid this.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `^22.22.3 || ^24.15.0 || >=26.0.0`
- **npm**: `v11.19.0` (pinned via the `packageManager` field)

### Installation
```bash
npm install
```

### Running the Application
```bash
# Development server with hot-reload at http://localhost:4200/
npm start

# Production build
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
