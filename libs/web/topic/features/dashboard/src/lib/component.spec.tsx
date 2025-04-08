import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  TestRootComponent,
} from '@tellme/web/shared/data-access/tests-data';
import { Dashboard } from './component';

import SpyInstance = jest.SpyInstance;

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
  OAuthProvider: jest.fn((providerId) => ({ providerId })),
}));

describe('Dashboard', () => {
  //let requestSpy: SpyInstance;
  // Optional
  beforeAll(() => {});

  beforeEach(() => {
    //requestSpy.mockClear();
    render(
      <TestRootComponent shouldAuthorize>
        <Dashboard />
      </TestRootComponent>,
    );
  });

  // Optional
  afterAll(() => {
    // Set up mocks and make other preparations actual for all test cases
  });

  // Optional
  afterEach(() => {
    // Actions after each test case
  });

  // Test cases
  it('should load topics initially', () => {
    // Actions with elements and results check
  });
  it('should do something', () => {
    // Actions with elements and results check
  });
  it('should do something', () => {
    // Actions with elements and results check
  });
  it('should do something', () => {
    // Actions with elements and results check
  });
  it('should do something', () => {
    // Actions with elements and results check
  });
});
