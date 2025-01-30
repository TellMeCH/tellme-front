import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Sign in using Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Grab the token from the user credential
      const token = await userCredential.user.getIdToken();

      // Pass the token back up to parent
      onLoginSuccess(token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div><br />
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div><br />
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default Login;