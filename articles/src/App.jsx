import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Articles from './pages/Articles';
import ProtectedRoute from './context/ProtectedRoute';
import './App.css';

function App() {
  return (
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
  );
}

export default App;
