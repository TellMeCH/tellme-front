import React, { useEffect } from 'react';
import { auth, firebase } from './firebase'; // our compat exports
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

function FirebaseUI({ onLoginSuccess }) {
  useEffect(() => {
    // Initialize the FirebaseUI Widget using the 'compat' firebase.auth()
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: async (authResult) => {
          // The user is signed in. Grab the token.
          const token = await authResult.user.getIdToken();
          // Pass the token back to the parent
          onLoginSuccess(token);

          // Return false to avoid any automatic redirects.
          return false;
        },
        uiShown: function() {
          // UI shown callback - optional
          console.log('FirebaseUI widget is rendered');
        },
      },
      // Use popup instead of redirect for OAuth flows
      signInFlow: 'popup',

      // Your array of sign-in options. For Google only:
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      // Where to redirect after a successful sign in (if using signInSuccessUrl):
      // signInSuccessUrl: '/some-url',

      // Terms of service url and privacy policy url can be added:
      // tosUrl: '<your-tos-url>',
      // privacyPolicyUrl: '<your-privacy-policy-url>'
    };

    // Start the UI
    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      // Cleanup on unmount: if you unmount the component, you might want to reset the UI
      ui.reset();
    };
  }, [onLoginSuccess]);

  return (
    <div>
      <div id="firebaseui-auth-container" />
      {/* Optionally, a loader or other UI elements could go here */}
    </div>
  );
}

export default FirebaseUI;