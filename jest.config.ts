const { getJestProjectsAsync } = require('@nx/jest');

module.exports = async () => ({
  projects: await getJestProjectsAsync(),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {},
});
