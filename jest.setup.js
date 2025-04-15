import '@testing-library/jest-dom';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => {
  const authResponse = {
    user: {
      email: 'test@example.com',
      getIdToken: jest.fn(() => Promise.resolve('token')),
    },
  };

  return {
    browserLocalPersistence: { type: 'LOCAL' },
    browserSessionPersistence: { type: 'SESSION' },
    getAuth: jest.fn(() => ({})),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve(authResponse)),
    setPersistence: jest.fn(() => Promise.resolve()),
    signInWithPopup: jest.fn(() => Promise.resolve(authResponse)),
    GoogleAuthProvider: jest.fn(() => ({ providerId: 'google.com' })),
    OAuthProvider: jest.fn((providerId) => ({ providerId })),
    signOut: jest.fn(() => Promise.resolve()),
  };
});

global.ResizeObserver = class {
  constructor(cb) {
    this.callback = cb;
  }

  observe = jest.fn(() => {
    this.callback?.(
      [
        {
          target: document.body,
          contentRect: { width: 100, height: 100 },
          borderBoxSize: [{ inlineSize: 100, blockSize: 100 }],
        },
      ],
      this,
    );
  });

  unobserve = jest.fn();
  disconnect = jest.fn();
};

global.DOMRect = {
  fromRect: () => ({ top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 }),
};

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
