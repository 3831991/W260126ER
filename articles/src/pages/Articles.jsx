import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, deleteArticle, getArticles, updateArticle } from '../api/articles';
import { useAuth } from '../context/useAuth';
import ArticleForm from './ArticleForm';
import moment from 'moment';
import './Articles.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Articles() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('loading');
  const [reloadToken, setReloadToken] = useState(0);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { logout, user, tokenExp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    getArticles()
      .then((data) => {
        if (ignore) return;
        setArticles(data);
        setStatus('ready');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [reloadToken]);

  function handleRetry() {
    setStatus('loading');
    setReloadToken((n) => n + 1);
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  function openAddForm() {
    setEditingArticle(null);
    setIsFormOpen(true);
  }

  function openEditForm(article) {
    setEditingArticle(article);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingArticle(null);
  }

  async function handleFormSubmit(articleData) {
    if (editingArticle) {
      await updateArticle(editingArticle._id, articleData);
    } else {
      await createArticle(articleData);
    }
    closeForm();
    setReloadToken((n) => n + 1);
  }

  async function handleDelete(article) {
    const confirmed = window.confirm(`למחוק את הכתבה "${article.headline}"?`);
    if (!confirmed) return;

    await deleteArticle(article._id);
    setReloadToken((n) => n + 1);
  }

  return (
    <div className="articles-page">
      <header className="articles-header">
        <div className="articles-header-inner">
          <div className="articles-brand">
            <i className="fa-solid fa-newspaper" />
            <h1>חדשות <span>היום</span></h1>
          </div>
          <div>
            <b>שלום {user?.fullName || 'אורח'}! </b>
            <button className="logout-btn" onClick={handleLogout}>התנתק</button>
          </div>
        </div>
      </header>
{/* לא לשכוח למחוק */}
<b style={{ textAlign: 'center' }}>{moment(tokenExp).format('DD/MM/yyyy HH:mm')} | {moment(tokenExp).fromNow()}</b>
      <main className="articles-main">
        <div className="articles-intro">
          <div>
            <h2>הכתבות האחרונות שלנו</h2>
            <p>כל מה שמעניין, חם ומעודכן במקום אחד.</p>
          </div>
          <button className="add-article-btn" onClick={openAddForm}>
            <i className="fa-solid fa-plus" /> כתבה חדשה
          </button>
        </div>

        {status === 'loading' && (
          <div className="articles-status">
            <div className="spinner" />
            <p>טוען כתבות עבורך...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="articles-error">
            <h3>אופס, משהו השתבש</h3>
            <p>לא הצלחנו למשוך את הכתבות מהשרת. ודא שה-API שלך דולק בפורט 3000.</p>
            <button onClick={handleRetry}>ניסיון חוזר</button>
          </div>
        )}

        {status === 'ready' && (
          <div className="articles-grid">
            {articles.length === 0 ? (
              <div className="articles-empty">אין כתבות להצגה כרגע.</div>
            ) : (
              articles.map((article) => (
                <article className="article-card" key={article._id}>
                  <div className="article-thumb">
                    <img
                      src={article.imgUrl || FALLBACK_IMAGE}
                      alt={article.headline}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <span className="article-badge">חדש</span>
                  </div>

                  <div className="article-body">
                    <div className="article-date">
                      <i className="fa-regular fa-calendar" />
                      <span>{formatDate(article.publishDate || article.addedTime)}</span>
                    </div>

                    <h3 className="article-headline">{article.headline}</h3>
                    <p className="article-description">{article.description}</p>

                    <div className="article-footer">
                      <button className="article-edit-btn" onClick={() => openEditForm(article)}>
                        <i className="fa-solid fa-pen" /> עריכה
                      </button>
                      <button className="article-delete-btn" onClick={() => handleDelete(article)}>
                        <i className="fa-solid fa-trash" /> מחיקה
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </main>

      <footer className="articles-footer">
        <p>© 2026 כל הזכויות שמורות לפורטל החדשות שלך</p>
      </footer>

      {isFormOpen && (
        <ArticleForm
          initialArticle={editingArticle}
          onCancel={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

export default Articles;
