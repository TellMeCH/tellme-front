# Testing rules

To create a test add a file `component.spec.tsx` near a component for testing and add tag "test" to a lib project.json.
The structure of the file should be the following. It's allowed to use several nested `describe`.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('Feature name', () => {
  // Optional
  beforeAll(() => {
    // Set up mocks and make other preparations actual for all test cases
  });

  // Optional
  beforeEach(() => {
    // Actions before each test case
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
  it('should do something', () => {
    // Actions with elements and results check
  });
});
```

Fixtures and test helpers should be in the lib `web/shared/data-access/tests-data`.
