# Main tools

## Core

- [React](https://react.dev/).
- [Next.js](https://nextjs.org)
- [Next Intl](https://next-intl.dev/) - localization for Next.js.

## UI

- [TailwindCSS](https://v3.tailwindcss.com/) - utility-first CSS framework.
- [Sass](https://sass-lang.com/) - CSS preprocessor. The [SCSS syntax](https://sass-lang.com/documentation/syntax/#scss) is used in tellme.
- [HeroUI](https://heroui.com/) - UI components.
- [Recharts](https://recharts.org/en-US/) - library for charts.

## Form Handling

- [React Hook Form](https://react-hook-form.com/) - form management.
- [Yup](https://www.npmjs.com/package/yup) - validation.

## Work with Data

- [Redux Toolkit](https://redux-toolkit.js.org/) - global state management.
- [React Redux](https://react-redux.js.org/) - React bindings for Redux.
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) - data fetching and caching entities.
- [Axios](https://axios-http.com/) - HTTP client.
- [Firebase Authentication](https://firebase.google.com/docs/auth) - authentication service.

## Testing

- [Jest](https://jestjs.io/) - testing framework for JavaScript.
- [Testing Library](https://testing-library.com/) - utilities for rendering components, interactions with them, and checking the DOM.

## Development Tools

- [TypeScript](https://www.typescriptlang.org/) - a strongly typed programming language that builds on JavaScript.
- [NX](https://nx.dev/) - tool for managing mono-repositories.
- [ESLint](https://eslint.org/) - linting tool for identifying and fixing problems in JavaScript code.
- [Prettier](https://prettier.io/) - code formatter.
- [Husky](https://typicode.github.io/husky/) - runs actions before committing. In tellme, these actions include type checking, linting, and formatting.

## Ready Solutions of Ronas IT

- [Nx Generators](https://www.npmjs.com/package/@ronas-it/nx-generators) - Nx tool.
- [Utilities for working with REST API using Axios](https://www.npmjs.com/package/@ronas-it/axios-api-client).
- [RTK Query entity API](https://www.npmjs.com/package/@ronas-it/rtkq-entity-api).

Most of the RTK Query entity API tools were developed to work with a backend created by Ronas IT,
which is why only the following functionality can be used in Tellme:

Enumerations:

- `EntityTagID`

Types:

- `AnyApi`
- `LifecycleApi`

Decorators:

- `TransformBoolean` to transform boolean values to 0 and 1 and vice versa.
- `TransformDate` to transform date strings to [Luxon](https://moment.github.io/luxon/#/?id=luxon) `DateTime` objects and vice versa.

Utilities:

- `storeActions`
- `createStoreInitializer`
- `createApiCreator`
- `createAxiosBaseQuery`
- `createEntityInstance`
- `immutableMerge`
- `isBrowserPlatform`
- `prepareRequestParams`
