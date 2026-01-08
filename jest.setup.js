import '@testing-library/jest-dom';
import sharedMessages from 'i18n/shared/en.json';
import accountMessages from 'i18n/web/account/en.json';
import administrationMessages from 'i18n/web/administration/en.json';
import customerExperienceMessages from 'i18n/web/customer-experience/en.json';
import webSharedMessages from 'i18n/web/shared/en.json';
import topicMessages from 'i18n/web/topic/en.json';
import { get, isNil, pick } from 'lodash';

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

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.doMock('next-intl', () => {
  const messages = {
    account: accountMessages,
    'web-shared': webSharedMessages,
    topic: topicMessages,
    shared: sharedMessages,
    administration: administrationMessages,
    'customer-experience': customerExperienceMessages,
  };

  return {
    useTranslations: jest.fn().mockImplementation((namespace) => {
      const t = jest.fn((key, values) => {
        const template = get(messages, `${namespace}.${key}`) || key;

        if (!values) {
          return template;
        }

        return Object.entries(values).reduce((result, [key, value]) => {
          const regex = new RegExp(`\\{${key}\\}|\\{${key}\\.(\\w+)\\}`, 'g');

          return result.replace(regex, (match, property) => {
            if (property) {
              return value?.[property] || match;
            }

            return !isNil(value) ? value.toString() : match;
          });
        }, template);
      });

      t.rich = t;

      return t;
    }),
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
