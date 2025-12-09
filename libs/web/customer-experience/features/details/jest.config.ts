export default {
  displayName: 'web/customer-experience/features/details',
  preset: '../../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/../../../../../jest.setup.js'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../../coverage/libs/web/customer-experience/features/details',
};
