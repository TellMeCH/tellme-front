# TellMe
The right call to know your customers.

---

## Project Description
TellMe aims to help companies understand their customer base by analyzing customer center calls.
This repository corresponds to the React frontend of the application.

## Execution
This React app requires the following environment variables to run:
* `REACT_APP_FIREBASE_CONFIG`: For local execution using the Firebase emulator, can be set to: `'{"apiKey":"fake-key","authDomain":"localhost","projectId":"","storageBucket":"","messagingSenderId":"","appId":""}'`
* `REACT_APP_BACKEND_URL`: Target URL of the corresponding backend. For local execution, use `"http://0.0.0.0:8080"`

To run the app in conjunction with the Firebase emulator, make sure to set the following:
* `REACT_APP_EMULATOR_AUTH_URL=http://localhost:9099`
This is compatible with the local execution of the backend project in its development environment (with ```bash ./run-compose.sh```)

## CI/CD Setup

### Environments
* `develop (TELLME_ENV="dev")`: Local environment, running on the docker-compose.yml file at the root of the project
* `staging (TELLME_ENV="staging")`: Staging environment, running on a separate GCP Project
* `main (TELLME_ENV="prod")`: Production environment, running on another separate GCP Project


### Branch Organization
This project has the following branch types:
* `feature/*`: Feature branches, onboarding new functionalities
* `fix/*`: Fix branches, allowing quick resolution of bugs
* `develop`: Branch corresponding to the development environment.
* `staging`: Branch corresponding to the staging environment. Whenever a PR to this branch is closed, a deployment workflow `deploy.yml` will be triggered.
* `main`: Branch corresponding to the production environment. Whenever a PR to this branch is closed, a deployment workflow `deploy.yml` will be triggered.

Code changes should flow through the branches in the following order:

`feature/*` >> `develop` >> `staging` >> `main`

Branch protection rules will not allow a different order.

### CI/CD Workflows
* `deploy.yml`: Simple deployment to CloudFlare Pages based on the above mentioned environment variables.

## Authentication
This frontend authenticates all requests with Firebase Authentication

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
