import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, login } from '../api/auth';
import { useAuth } from '../context/useAuth';
import './Auth.css';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signup({ firstName, lastName, email, password });
      const token = await login({ email, password });
      loginWithToken(token);
      navigate('/employees', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">👤</div>
        <h1 className="auth-title">יצירת חשבון</h1>
        <p className="auth-subtitle">הצטרפו כדי להתחיל לנהל עובדים</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <div className="auth-field">
              <label htmlFor="firstName">שם פרטי</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">שם משפחה</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

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
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'נרשם...' : 'הרשמה'}
          </button>
        </form>

        <p className="auth-switch">
          כבר יש לך חשבון? <Link to="/login">להתחברות</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
