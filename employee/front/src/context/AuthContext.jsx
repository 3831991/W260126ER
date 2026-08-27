import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './auth-context';
import { jwtDecode } from 'jwt-decode';
import { renewToken } from '../api/auth';

// כמה זמן לפני הפקיעה מבקשים טוקן חדש מהשרת
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;

function decode(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

// זמן הפקיעה במילישניות, או null אם הטוקן פגום
function getExpiration(token) {
  const payload = decode(token);

  return payload?.exp ? payload.exp * 1000 : null;
}

// בטעינת האפליקציה לא מחזירים טוקן שכבר פג - אין מה לחדש ממנו
function readStoredToken() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  const exp = getExpiration(token);

  if (!exp || exp <= Date.now()) {
    localStorage.removeItem('token');
    return null;
  }

  return token;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);

  // מונע שתי בקשות חידוש במקביל (StrictMode, חזרה ללשונית וכו')
  const renewingRef = useRef(false);

  const user = useMemo(() => (token ? decode(token) : null), [token]);

  const loginWithToken = useCallback(newToken => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  const renew = useCallback(async () => {
    if (renewingRef.current) {
      return;
    }

    renewingRef.current = true;

    try {
      loginWithToken(await renewToken());
    } catch {
      // השרת דחה את הטוקן - אין ממה לחדש
      logout();
    } finally {
      renewingRef.current = false;
    }
  }, [loginWithToken, logout]);

  useEffect(() => {
    if (!token) {
      return;
    }

    // טוקן פגום נשלח מיד לחידוש, השרת ידחה אותו והמשתמש יתנתק
    const exp = getExpiration(token) ?? 0;

    let timeoutId;

    function scheduleRenew() {
      clearTimeout(timeoutId);

      const timeToExpire = exp - Date.now();

      if (timeToExpire <= REFRESH_THRESHOLD_MS) {
        renew();
      } else {
        timeoutId = setTimeout(renew, timeToExpire - REFRESH_THRESHOLD_MS);
      }
    }

    // אחרי שהמחשב חוזר משינה הטיימר עלול לאחר, לכן בודקים מחדש בחזרה ללשונית
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        scheduleRenew();
      }
    }

    scheduleRenew();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token, renew]);

  // סנכרון בין לשוניות - התחברות או התנתקות בלשונית אחת משפיעה על כולן
  useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    }

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: Boolean(token), loginWithToken, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}
