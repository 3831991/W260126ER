import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Employees from './components/Employees';
import ProtectedRoute from './context/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="*" element={<Navigate to="/employees" replace />} />
    </Routes>
  );
}

export default App
