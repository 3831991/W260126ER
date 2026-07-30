import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Articles from './pages/Articles';
import ProtectedRoute from './context/ProtectedRoute';
import './App.css';
import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

export const UserDataContext = createContext();

function App() {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [tokenExp, setTokenExp] = useState();

  useEffect(() => {
    if (token) {
      const payload = jwtDecode(token);
      const exp = new Date(payload.exp * 1000);

      setTokenExp(exp);
      setUser(payload);
    }
    
  }, [token])

  return (
    <UserDataContext.Provider value={{ user, setToken }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/articles" replace />} />
        <Route path="*" element={<Navigate to="/articles" replace />} />
      </Routes>
    </UserDataContext.Provider>
  );
}

export default App;
