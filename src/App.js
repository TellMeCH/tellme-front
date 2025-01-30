import React, { useState, useEffect } from 'react';
import Login from './Login';

function App() {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // This function is passed to <Login /> to store the token upon success
  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  useEffect(() => {
    // If we have a token, fetch data from the backend
    if (token) {
      const fetchData = async () => {
        setFetchError(null);
        setData(null);

        const url = process.env.REACT_APP_BACKEND_URL + '/api/v1/conversations/';

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          setData(result);
        } catch (error) {
          setFetchError(error.message);
        }
      };

      fetchData();
    }
  }, [token]);

  return (
      <div style={{textAlign: 'center', marginTop: '50px'}}>
        <h1>Welcome to tellme</h1>
        <h2>Making the right call to know your customers.</h2>

        {!token ? (
            <Login onLoginSuccess={handleLoginSuccess}/>
        ) : (
            <div>
              <h2>You are logged in!</h2>
              {fetchError && <p style={{color: 'red'}}>Error fetching data: {fetchError}</p>}
              {data ? (
                  <pre style={{textAlign: 'left', display: 'inline-block'}}>
              {JSON.stringify(data, null, 2)}
            </pre>
              ) : (
                  <p>Loading data...</p>
              )}
            </div>
        )}
      </div>
  );
}

export default App;