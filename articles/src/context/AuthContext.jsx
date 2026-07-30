import { useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { jwtDecode } from 'jwt-decode';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState();
  const [tokenExp, setTokenExp] = useState();

  function loginWithToken(newToken) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  useEffect(() => {
    if (token) {
      const payload = jwtDecode(token);
      const exp = new Date(payload.exp * 1000);

      setTokenExp(exp);
      setUser(payload);
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: Boolean(token), loginWithToken, logout, user, tokenExp }}>
      {children}
    </AuthContext.Provider>
  );
}
