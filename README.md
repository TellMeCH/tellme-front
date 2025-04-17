# TellMe

The right call to know your customers.

---

## Project Description

TellMe aims to help companies understand their customer base by analyzing customer center calls.
This repository corresponds to the React frontend of the application.

## Execution

This React app requires the following environment variables to run:

- `REACT_APP_FIREBASE_CONFIG`: For local execution using the Firebase emulator, can be set to: `'{"apiKey":"fake-key","authDomain":"localhost","projectId":"","storageBucket":"","messagingSenderId":"","appId":""}'`
- `REACT_APP_BACKEND_URL`: Target URL of the corresponding backend. For local execution, use `"http://0.0.0.0:8080"`

To run the app in conjunction with the Firebase emulator, make sure to set the following:

- `REACT_APP_EMULATOR_AUTH_URL=http://localhost:9099`
  This is compatible with the local execution of the backend project in its development environment (with `bash ./run-compose.sh`)

## CI/CD Setup

### Environments

- `develop (TELLME_ENV="dev")`: Local environment, running on the docker-compose.yml file at the root of the project
- `staging (TELLME_ENV="staging")`: Staging environment, running on a separate GCP Project
- `main (TELLME_ENV="prod")`: Production environment, running on another separate GCP Project

### Branch Organization

This project has the following branch types:

- `feature/*`: Feature branches, onboarding new functionalities
- `fix/*`: Fix branches, allowing quick resolution of bugs
- `develop`: Branch corresponding to the development environment.
- `staging`: Branch corresponding to the staging environment. Whenever a PR to this branch is closed, a deployment workflow `deploy.yml` will be triggered.
- `main`: Branch corresponding to the production environment. Whenever a PR to this branch is closed, a deployment workflow `deploy.yml` will be triggered.

Code changes should flow through the branches in the following order:

`feature/*` >> `develop` >> `staging` >> `main`

Branch protection rules will not allow a different order.

### CI/CD Workflows

- `deploy.yml`: Simple deployment to CloudFlare Pages based on the above mentioned environment variables.

## Authentication

This frontend authenticates all requests with Firebase Authentication

---

## Getting started

1. Install dependencies: `npm install`
1. Launch desired app for development:

```sh
npx nx start web
```

More details you can see in `apps/web/README.md`.

## Resources

Below are links to tools and services used in this project:

- [Tasks](https://app.clickup.com/24336023/v/l/6-901508600875-1)
- [Design](https://www.figma.com/design/rDFbE3FnlgDKuEeoUAaMqN/Tell-me-%E2%80%94-Web?t=AHRhPlZe9NKj41iH-0)

## Repository management

This workspace uses [Nx](https://nx.dev/getting-started/intro) for repository management and code generation.
You can install [Nx extension](https://nx.dev/getting-started/editor-setup) for your code editor.

### Code generation

We use [custom Nx generators](https://github.com/RonasIT/nx-generators) plugin for code generation.\
Run `npx nx list @ronas-it/nx-generators` to view a list of available generators in the plugin.\
Each generator accepts the `--help` argument to show instructions.

#### Generate libraries

Example:

```sh
npx nx g react-lib
```

Check [the generators docs](https://github.com/RonasIT/nx-generators/blob/main/README.md#generators-overview) for more operations with libraries.

#### Generate components

- `npx nx g react-component` - generate a root component in some library
- `npx nx g react-component --name=AppButton --subcomponent` - generate a library sub-component.

#### Generate apps

- `npx nx g next-app` - generate new Next app

### Running apps

- `npm run build:web` - build the web app
- `npm run start:web` - build and start the web app like after deployment
- `npm run dev:web` - run the web app in debugging mode

- `npm run build:landing` - build the landing app
- `npm run start:landing` - build and start the landing app like after deployment
- `npm run dev:landing` - run the landing app in debugging mode

### Running tasks

To execute tasks with Nx use the following syntax: `npx nx <target> <project> <...options>`.\
You can also run multiple targets: `npx nx run-many -t <target1> <target2>`.\
Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Dependencies management

This repository uses [NPM Workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) to manage dependencies.
Dependencies that used in `libs` should be listed both in root and app's `package.json`.

### Installing dependencies

Run the following scripts in the repository root:

- `npm i {some-package} -w {app-name} -iwr` - install some package for particular app and for the whole repository
- `npm i {some-package} -ws -iwr` - install some package for all apps and including root one `package.json`

You can also navigate to an app directory and install package there:

- `npm i {some-package} -iwr`

### Uninstalling dependencies

The same rules apply to removing dependencies:

- `npm uni {some-package} -w {app-name} -iwr` - uninstall some package for particular app and for the whole repository
- `npm uni {some-package} -ws -iwr` - uninstall some package for all apps and including root `package.json`

### Syncing dependencies

To check consistency of packages versions across workspaces run the following command in the project root:

- `npm run deps:sync`

After that check the changes and run `npm i` to install adjusted versions.

## Code checks

This project has pre-configured linting and formatting rules with pre-commit hook.
You can execute these commands for the whole project manually:

- `npm run lint` - run necessary code checks
- `npm run format` - run code autoformat

## Tests

To run tests use the command `npm run test` in the root of the repository.
