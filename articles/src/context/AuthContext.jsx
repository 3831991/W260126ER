import { useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { jwtDecode } from 'jwt-decode';
import { renewToken } from '../api/auth';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState();

  function loginWithToken(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  async function createNewToken() {
    const token = await renewToken();
    setToken(token);
  }

  useEffect(() => {
    if (token) {
      const payload = jwtDecode(token);
      const exp = new Date(payload.exp * 1000);

      setUser(payload);
      checkTokenExpired(exp);
    }
  }, [token])

  async function checkTokenExpired(exp) {
    const now = +new Date();
    const timeToExpire = exp - now;
    const refreshThreshold = 5 * 60 * 1000;
    
    if (timeToExpire <= 0) {
      logout();
    } else if (timeToExpire <= refreshThreshold) {
      createNewToken();
    } else {
      setTimeout(createNewToken, timeToExpire - refreshThreshold);
    }
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: Boolean(token), loginWithToken, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}
