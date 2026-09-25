# CodeQuest DevTalles Front - System Architecture & Context

This document serves as persistent context and memory for AI Assistants (Cursor, GitHub Copilot, ChatGPT, Claude) working on this codebase.

---

## 🏛️ System Architecture Overview

The client is a **zoneless, signal-first Angular 22 SPA** (standalone components, no NgModules) styled with TailwindCSS v4 and spartan/ui. It follows a **feature-sliced** structure: each feature owns its pages, services, models and routes, with zero cross-feature coupling.

```text
src/
 ├── app/
 │    ├── core/                 # Cross-cutting infrastructure (no UI)
 │    │    ├── auth/
 │    │    │    ├── session-store.ts        # Session signals (single source of truth)
 │    │    │    ├── auth-guard.ts           # CanActivateFn for the authenticated shell
 │    │    │    └── admin-guard.ts          # CanActivateFn for the admin subtree
 │    │    └── http/
 │    │         ├── auth-interceptor.ts     # HttpInterceptorFn, injects Bearer token
 │    │         └── error-interceptor.ts    # HttpInterceptorFn, handles 401
 │    │
 │    ├── layouts/              # Route-level shells, each owning a router-outlet
 │    │    ├── main-layout/     # Authenticated shell (header + navigation)
 │    │    └── auth-layout/     # Public shell for login and registration
 │    │
 │    ├── features/             # Isolated domains, one folder per owner
 │    │    ├── landing/  auth/  assessment/  paths/  admin/
 │    │    │    ├── pages/<page-name>/       # Route components
 │    │    │    ├── services/                # <feature>-api.ts, <feature>-store.ts
 │    │    │    ├── models/                  # <feature>-models.ts (types only)
 │    │    │    ├── constants/               # <feature>-constants.ts (static data, label maps)
 │    │    │    ├── components/              # Section components, feature-local
 │    │    │    ├── pipes/                   # <name>.pipe.ts, display transforms, feature-local
 │    │    │    └── <feature>.routes.ts      # Lazy routes (multi-page features only)
 │    │
 │    ├── shared/               # Feature-agnostic reusable pieces
 │    │    ├── ui/             # Presentational components shared by features
 │    │    ├── icons/          # Raw SVG strings consumed by provideIcons()
 │    │    └── pages/          # Feature-agnostic routes
 │    ├── app.routes.ts         # Root routing table and layout composition
 │    └── app.config.ts         # Application providers
 │
 ├── environments/              # Build-time config swapped via fileReplacements
 └── styles.css                 # Tailwind entry point and design tokens

libs/ui/                        # spartan/ui helm components (owned, not vendored)
```

---

## ⚡ Zoneless Change Detection (Critical)

The application runs **without `zone.js`**. `provideZonelessChangeDetection()` is registered in `app.config.ts`, and `OnPush` is the default strategy for every component.

**Consequence for any generated code:** a plain class field mutated from an asynchronous callback will **not** re-render the view. All state a template reads must live in a signal.

```ts
// WRONG - the view will never update
export class PathsPage {
  paths: Path[] = [];
  load() {
    this.api.list().subscribe((p) => (this.paths = p));
  }
}

// CORRECT
export class PathsPage {
  private readonly _paths = signal<readonly Path[]>([]);
  readonly paths = this._paths.asReadonly();
  load() {
    this.api.list().subscribe((p) => this._paths.set(p));
  }
}
```

---

## 🧠 State Management Rules

1. **Native signals only.** Do not introduce NgRx, NGXS, Akita, or `BehaviorSubject`-based stores.
2. **Stores expose read-only signals.** The writable signal stays private; mutation happens only through explicit methods:

   ```ts
   @Service()
   export class SessionStore {
     private readonly _user = signal<SessionUser | null>(null);

     readonly user = this._user.asReadonly();
     readonly isAuthenticated = computed(() => this._user() !== null);

     setSession(user: SessionUser, token: string): void {
       /* ... */
     }
   }
   ```

3. **`@Service()` over `@Injectable()`.** Angular 22 introduces the `@Service()` decorator, which is auto-provided and tree-shakable. It is the CLI default and the convention here.
4. **Derived state uses `computed()`**, never a method call in the template.

---

## 🎨 UI Layer: spartan/ui + TailwindCSS v4

1. **Never build custom primitives.** Buttons, cards, inputs, dialogs, tabs, selects and the rest already exist under `libs/ui/` and are imported through the `@spartan-ng/helm/*` path aliases declared in `tsconfig.json`.
2. **Compose classes with `hlm()`**, exported from `@spartan-ng/helm/utils`. Do not create a local `cn()` helper.
3. **Do not modify `components.json` or `src/styles.css`** without an explicit instruction. They hold the spartan configuration and the design tokens.
4. **spartan directives are attribute selectors.** Angular silently ignores an unknown attribute such as `hlmBtn`, producing an unstyled element with no error at all. Always register the directive, preferring the exported barrels:

   ```ts
   imports: [HlmCardImports, HlmButton, HlmInput, HlmLabel];
   ```

5. **No component stylesheets.** Components are generated and kept without a `styleUrl`; all styling goes through Tailwind utilities.

---

## 🧭 Routing Rules

- Individual pages use `loadComponent`; features with more than one page use `loadChildren` pointing at their own `*.routes.ts`.
- **Layouts are parent routes.** A guard declared on the shell protects the entire subtree, so it must not be repeated on each child.
- A route may legally combine `loadComponent` (the shell) with `loadChildren` (its children). Only `children` + `loadChildren` and `component` + `loadComponent` are rejected by the router.

| Route | Shell | Guard |
| --- | --- | --- |
| `/` | — | public |
| `/auth/login`, `/auth/registro` | `AuthLayout` | public |
| `/mis-rutas`, `/mis-rutas/:id` | `MainLayout` | `authGuard` |
| `/cuestionario` | `MainLayout` | `authGuard` |
| `/admin` | `MainLayout` | `authGuard` + `adminGuard` |
| `**` | — | `NotFoundPage` |

- Route parameters reach components as signal inputs through `withComponentInputBinding()`; prefer `input.required<string>()` over injecting `ActivatedRoute`.
- User-facing URL segments are in **Spanish** (`/mis-rutas`, `/cuestionario`, `/registro`). Identifiers in code remain in English.

---

## ⚙️ Environment Configuration

`src/environments/environment.ts` (production) is replaced by `environment.development.ts` at build time through the `fileReplacements` entry in `angular.json`. Both are typed against the shared `AppEnvironment` interface in `environment-model.ts`, so a key added to one file and omitted in the other fails the build instead of failing at runtime.

API services read `environment.apiUrl`. There is no generic `ApiService`: each feature owns its `<feature>-api.ts`.

---

## 🧱 File Naming & Scaffolding

Files carry **no type suffix**: `path-detail.ts`, never `path-detail.component.ts`. The Angular 22 CLI already produces this, so no flags are needed.

```bash
ng generate component features/paths/pages/my-paths-page --skip-tests
ng generate guard core/auth/auth --implements=CanActivate --skip-tests
ng generate interceptor core/http/auth --skip-tests
```

- Do **not** pass `--standalone` or `--functional`; both are the Angular 22 default.
- Delete the `.css` file the component schematic generates.
- Stores, API services, models, constants and route files are written by hand, not scaffolded.
- Page components stay thin. A `models/<feature>-models.ts` file holds **types only**; hardcoded content, preview data and status-to-copy maps go in `constants/<feature>-constants.ts`. The component keeps just the fields its template reads.

---

## 🛠️ Codebase Guidelines for AI Agents

1. **Language**: All code, comments, documentation and commit messages MUST be written strictly in **English**. The only exception is user-facing URL segments and UI copy, which are in Spanish.
2. **Strict Typing**: Enforce strict TypeScript types. Avoid `any`; prefer `unknown` with narrowing when a contract is not yet defined.
3. **Immutability**: Never mutate a signal's value in place. Use `set()` or `update()` and treat collections as `readonly`.
4. **No NgModules**: Every component, directive and pipe is standalone.
5. **Commits**: Follow the Conventional Commits standard defined in [CONTRIBUTING.md](../CONTRIBUTING.md).
