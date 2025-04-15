# Architecture

The architecture is based on a [feature-oriented approach](https://www.cs.cmu.edu/~ckaestne/pdf/JOT09_OverviewFOSD.pdf) and inspired by [Nx recommendations](https://nx.dev/more-concepts/applications-and-libraries#mental-model):

- The application acts as a container, manages navigation, and uses code from libraries.
- Business logic is implemented within libraries.
- Navigation changes should not affect business logic.
- Libraries must not depend on the application.
- Libraries can trigger navigation actions, but should avoid depending on specific screens or navigation routes.
- Libraries are divided into several [types](#library-types) and follow strict dependency rules.
- Bounded contexts from [Domain-driven design](https://en.wikipedia.org/wiki/Domain-driven_design) are applied for large systems.

## Repository Structure

The codebase is organized into the following directories:

- `apps` – Application code: handles routing and navigation; uses libraries.
- `libs` – Libraries: implement business logic; must not depend on application code.
- `i18n` – Application translations.
- `docs` – Project documentation.
- `patches` – Custom npm package patches.

### Applications

Application code is located within the grouped `apps` directory.

<!-- prettier-ignore -->
```ts
apps/{application}/{*}
```

Where application is the name of the app.

Each application directory contains:

- `app` - navigation and screens directory.
- Configuration files;
- нNavigation settings;
- Test environment files;
- Any other application-specific files.

### Libraries

Most of the code is placed in application libraries – they implement business logic and are designed for reuse. Directory structure inside `libs` follows this pattern:

<!-- prettier-ignore -->
```ts
libs/{application}/{scope?}/{type}/{name}
```

Where:

1. `application` – the name of one of the applications, or `shared`.

- If there are multiple applications, shared libraries should be placed in the `shared` directory.
- Inside `shared`, separating by contexts is not required.

2. `scope` – the name of a [bounded context](https://martinfowler.com/bliki/BoundedContext.html), grouping directory, or `shared`.

- If the project applies [bounded contexts](https://martinfowler.com/bliki/BoundedContext.html), dependencies **between contexts are not allowed**.
- If bounded contexts are not used, it's recommended to group libraries by business logic or functionality (e.g., auth, profile, etc.). Dependencies between them are not forbidden, but discouraged.
- The `shared` scope contains libraries used across multiple contexts or groups.
- This level can be omitted in small apps where grouping isn’t needed (e.g., single-page apps).

. `type` – indicates the [library type](https://nx.dev/more-concepts/library-types) (more on types [below](#library-types)):

- Recommended types: `features`, `data-access`, `ui`, or `utils`.
- You may introduce additional commonly accepted library types.
- `shared` is **not allowed** as a type.

4. `name` – the name of the library.

### Translations

The `i18n` directory contains translations for applications and their libraries. Translation files for different languages are grouped by application and context/group:

<!-- prettier-ignore -->
```ts
i18n/{application}/{scope?}/{language}.json
```

- `application` – the name of the application.
- `scope` – the name of a bounded context/group, `app` (for navigation-related translations), or `shared`. This level is optional.
- `language` – the language code (e.g., `en`, `ru`, `fi`).

### Assets

Assets (images, fonts, and other files) are recommended to be stored in the libraries where they are used — in an `assets` directory inside the corresponding library.

Allowed paths:

<!-- prettier-ignore -->
```ts
libs/{application}/{scope}/{type}/{name}/assets
...
// Example: assets of the shared `ui-kit` library
libs/shared/ui/ui-kit/assets
```

## Library Types

Libraries are divided into types that reflect different layers of responsibility: smart and dumb component libraries, data access libraries, utilities, etc.

### `Util` Libraries

- Contain low-level utility code;
- Must not implement business logic or manage state;
- Can only depend on other utility libraries.  
  Exception: utilities for mapping data structures and UI (e.g., enum translations).

### `Data-access` Libraries

- Contain code for interacting with data sources;
- May include state management, data models, and structures;
- Must not contain UI components;
- Data models must not include presentation logic – it should live in utility libraries  
  (e.g., avoid date formatting getters in models);
- Can only depend on `data-access` and `util` libraries.

### `UI` Libraries

- Contain dumb (presentational) components;
- Do not implement business logic, do not manage state, and are fully controlled by props;
- Can only depend on `utils`, other `ui` libraries, and data structures from `data-access`  
  (e.g., props describing a domain entity);
- Can have local state (e.g., `useState` is allowed);
- Must not use global state (e.g., `useSelector` from `react-redux` is not allowed).

### `Feature` Libraries

- Contain smart (container) components;
- Implement business logic, interact with state, and modify it;
- Can use libraries of any other type.

Libraries may include their own subcomponents, utilities, or internal data structures  
**as long as they are specific to that library**. These should be placed inside subdirectories like `{library}/{components|models|forms|...}`.  
If a subcomponent is needed outside the library, it should be moved to a separate library.

### Library Types Table

| Type        | Purpose                              | State Management | UI Layer | Allowed Dependencies                 |
| ----------- | ------------------------------------ | ---------------- | -------- | ------------------------------------ |
| Util        | Low-level utility code               | None             | No       | Util and types from Data-Access      |
| Data-Access | Data source interaction              | Global only      | No       | Util and Data-Access                 |
| UI          | Dumb (presentational) components     | Local only       | Yes      | UI, Util, and types from Data-Access |
| Feature     | Business logic and state interaction | Local and global | Yes      | Any libraries                        |

## Repository Structure

<!-- prettier-ignore -->
```sh
tellme-front
├── apps/ # Applications
│   ├── landing/ # Landing app
│   │   ├── app/ # Routing structure (Next.js App Router)
│   │   │   └── [locale]/ # Locale-specific routes (i18n)
│   │   │       ├── layout.tsx # Shared layout for the landing app
│   │   │       └── page.tsx # Main landing page
│   │   └── ... # Project configs (tsconfig, next.config, etc.)
│   └── web/ # Web application
│       ├── app/ # Routing structure (Next.js App Router)
│       │   └── [locale]/ # Locale-specific routes (i18n)
│       │       ├── (main)/ # Main group layout
│       │       │   ├── dashboard # Dashboard screen
│       │       │   ├── topic-analysis # Topic analytics page
│       │       │   ├── topics # List of topics
│       │       │   └── layout.tsx # Layout for the (main) group
│       │       ├── layout.tsx # App-wide layout
│       │       ├── page.tsx # Root index page
│       │       └── providers.tsx # Global providers (i18n, theme, etc.)
│       └── ... # Project configs (middleware, tsconfig, etc.)
├── i18n/ # Translation files
│   ├── landing/ # Landing app translations
│   ├── web/ # Web app translations
│   └── shared/ # Translations shared across apps
├── libs/ # Reusable libraries grouped by app/scope/type
│   ├── landing/ # Landing app libraries
│   │   └── shared/
│   │       ├── features/
│   │       │   └── home/ # Home section for the landing page
│   │       └── ui/
│   │           └── ui-kit/ # Reusable UI components
│   ├── shared/ # Libraries shared across all apps
│   │   ├── ui/
│   │   │   ├── styles/ # Global SCSS variables and font definitions
│   │   │   ├── toast/ # Reusable toast component
│   │   │   └── ui-kit/ # Shared core UI elements (buttons, inputs, etc.)
│   │   └── utils/ # General-purpose utilities
│   │       ├── constants/ # Global constants
│   │       └── i18n/ # i18n helpers and types
│   └── web/ # Web app libraries
│       ├── account/ # Account-related domain
│       │   └── features/
│       │       └── login/ # Login form and logic
│       ├── administration/ # Administration domain
│       │   └── features/
│       │       └── administration/ # Admin management logics
│       ├── shared/ # Shared libraries used across all web domains
│       │   ├── data-access/
│       │   │   ├── api/ # RTK Query API definitions per domain (endpoints, models)
│       │   │   ├── api-client/ # API client configuration
│       │   │   ├── auth/ # Authentication logic and state
│       │   │   ├── store/ # Redux Toolkit store configuration
│       │   │   └── tests-data/ # Fake/mock data for testing, helpers
│       │   ├── features/
│       │   │   └── layout/ # App shell (sidebar, layout components)
│       │   ├── ui/
│       │   │   ├── ui-kit/ # Shared reusable UI components
│       │   │   └── under-construction/ # Component to show placeholder UI
│       │   └── utils/
│       │       ├── class-transformer/ # Utilities for mapping models with decorators
│       │       ├── dates/ # Date formatting helpers
│       │       ├── form/ # Form-related helpers/types
│       │       ├── navigation/ # Routing/navigation-related helpers
│       │       ├── strings/ # String manipulation utils
│       │       └── use-responsive-layout/ # Hook for responsive UI rendering
│       └── topic/ # Topic-related domain
│           ├── features/
│           │   ├── analysis/ # Topic analysis
│           │   ├── dashboard/ # Dashboard
│           │   └── management/ # Managment
│           └── ui/ # UI components used across topic domain
├── docs/ # Developer documentation
├── patches/ # NPM patches applied via patch-package
├── package.json # Root dependencies and scripts
└── ... # Global config files (tsconfig, eslint, etc.)
```
