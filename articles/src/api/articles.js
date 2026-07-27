const API_URL = 'http://localhost:3000';

function authHeaders() {
  return {
    Authorization: localStorage.getItem('token'),
  };
}

export async function getArticles() {
  const res = await fetch(`${API_URL}/articles`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error('לא הצלחנו למשוך את הכתבות מהשרת');
  }

  return res.json();
}

export async function createArticle(article) {
  const res = await fetch(`${API_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(article),
  });

  if (!res.ok) {
    throw new Error('לא הצלחנו להוסיף את הכתבה');
  }

  return res.json();
}

export async function updateArticle(id, article) {
  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(article),
  });

  if (!res.ok) {
    throw new Error('לא הצלחנו לעדכן את הכתבה');
  }
}

export async function deleteArticle(id) {
  const res = await fetch(`${API_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error('לא הצלחנו למחוק את הכתבה');
  }
}
