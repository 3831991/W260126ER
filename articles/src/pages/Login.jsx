import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/useAuth';
import './Auth.css';
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const token = await login({ email, password });
      loginWithToken(token);

      const payload = jwtDecode(token);
      const exp = new Date(payload.exp * 1000);
      console.log(exp)

      const redirectTo = location.state?.from ?? '/articles';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <i className="fa-solid fa-newspaper" />
        </div>
        <h1 className="auth-title">ברוכים השבים</h1>
        <p className="auth-subtitle">התחברו כדי לקרוא את הכתבות האחרונות</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'מתחבר...' : 'התחברות'}
          </button>
        </form>

        <p className="auth-switch">
          עדיין אין לך חשבון? <Link to="/signup">להרשמה</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
