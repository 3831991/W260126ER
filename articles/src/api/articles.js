const API_URL = 'http://localhost:3000';

export async function getArticles() {
  const res = await fetch(`${API_URL}/articles`);

  if (!res.ok) {
    throw new Error('לא הצלחנו למשוך את הכתבות מהשרת');
  }

  return res.json();
}
