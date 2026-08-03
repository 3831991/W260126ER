import { useEffect, useState } from "react";
import "./Images.css";

const API_URL = "http://localhost:3333";

export default function Images() {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const getImages = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/images`);

    if (res.ok) {
      setImages(await res.json());
    }
    setLoading(false);
  };

  const deleteImage = async (fileName) => {
    const confirmed = window.confirm(`למחוק את התמונה "${fileName}"?`);
    if (!confirmed) return;

    const res = await fetch(`${API_URL}/images/${encodeURIComponent(fileName)}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setImages((prev) => prev.filter((img) => img !== fileName));
      setSelected((prev) => (prev === fileName ? null : prev));
    }
  };

  const uploadImage = async ev => {
    const file = ev.target.files[0];

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_URL}/images/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      getImages();
    }
  }

  return (
    <div className="gallery-page">
      <h1 className="gallery-title">הגלריה שלי</h1>

      {loading && <p className="gallery-status">טוען תמונות...</p>}
      {!loading && images.length === 0 && (
        <p className="gallery-status">אין תמונות להצגה</p>
      )}

      <div className="gallery-grid">
        {images.map((fileName) => (
          <div className="gallery-item" key={fileName}>
            <img
              src={`${API_URL}/files/${fileName}`}
              alt={fileName}
              onClick={() => setSelected(fileName)}
            />
            <button
              className="delete-btn"
              title="מחיקת תמונה"
              onClick={(e) => {
                e.stopPropagation();
                deleteImage(fileName);
              }}
            >
              &#10005;
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="lightbox-overlay" onClick={() => setSelected(null)}>
          <button
            className="lightbox-close"
            onClick={() => setSelected(null)}
            title="סגירה"
          >
            &#10005;
          </button>
          <img
            className="lightbox-image"
            src={`${API_URL}/files/${selected}`}
            alt={selected}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-delete"
            onClick={(e) => {
              e.stopPropagation();
              deleteImage(selected);
            }}
          >
            מחיקת תמונה
          </button>
        </div>
      )}

      <br />
      <input type="file" onChange={uploadImage} />
    </div>
  );
}
