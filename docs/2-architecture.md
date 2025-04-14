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
-

### Libraries

Most of the code is placed in application libraries – they implement business logic and are designed for reuse. Directory structure inside `libs` follows this pattern:

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

1. `type` – indicates the [library type](https://nx.dev/more-concepts/library-types) (more on types [below](#library-types)):

- Recommended types: `features`, `data-access`, `ui`, or `utils`.
- You may introduce additional commonly accepted library types.
- `shared` is **not allowed** as a type.

4. `name` – the name of the library.

### Translations

The `i18n` directory contains translations for applications and their libraries. Translation files for different languages are grouped by application and context/group:

```ts
i18n/{application}/{scope?}/{language}.json
```

- `application` – the name of the application.
- `scope` – the name of a bounded context/group, `app` (for navigation-related translations), or `shared`. This level is optional.
- `language` – the language code (e.g., `en`, `ru`, `fi`).

### Assets

Assets (images, fonts, and other files) are recommended to be stored in the libraries where they are used — in an `assets` directory inside the corresponding library.

Allowed paths:

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
