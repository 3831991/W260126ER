export const API_URL = 'http://localhost:4000';

async function parseError(res) {
  try {
    const data = await res.json();
    return data.message || 'משהו השתבש, נסה שוב';
  } catch {
    return 'משהו השתבש, נסה שוב';
  }
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.text();
}

export async function signup({ firstName, lastName, email, password }) {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}

export async function renewToken() {
  const res = await fetch(`${API_URL}/renew-token`, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.text();
}
