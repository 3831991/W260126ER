import { useState } from 'react';
import './ArticleForm.css';

function toDateInputValue(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toISOString().slice(0, 10);
}

function ArticleForm({ initialArticle, onCancel, onSubmit }) {
  const isEditing = Boolean(initialArticle);

  const [headline, setHeadline] = useState(initialArticle?.headline ?? '');
  const [description, setDescription] = useState(initialArticle?.description ?? '');
  const [content, setContent] = useState(initialArticle?.content ?? '');
  const [imgUrl, setImgUrl] = useState(initialArticle?.imgUrl ?? '');
  const [publishDate, setPublishDate] = useState(toDateInputValue(initialArticle?.publishDate));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit({ headline, description, content, imgUrl, publishDate });
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="article-form-overlay" onClick={onCancel}>
      <div className="article-form-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="article-form-title">{isEditing ? 'עריכת כתבה' : 'כתבה חדשה'}</h2>

        <form className="article-form" onSubmit={handleSubmit}>
          <div className="article-form-field">
            <label htmlFor="headline">כותרת</label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />
          </div>

          <div className="article-form-field">
            <label htmlFor="description">תקציר</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="article-form-field">
            <label htmlFor="content">תוכן</label>
            <textarea
              id="content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="article-form-row">
            <div className="article-form-field">
              <label htmlFor="imgUrl">קישור לתמונה</label>
              <input
                id="imgUrl"
                type="url"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="article-form-field">
              <label htmlFor="publishDate">תאריך פרסום</label>
              <input
                id="publishDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="article-form-error">{error}</div>}

          <div className="article-form-actions">
            <button type="button" className="article-form-cancel" onClick={onCancel}>
              ביטול
            </button>
            <button type="submit" className="article-form-submit" disabled={isSubmitting}>
              {isSubmitting ? 'שומר...' : isEditing ? 'שמירה' : 'הוספה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ArticleForm;
