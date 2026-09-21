import React, { useState, useEffect } from 'react';

const emptyBook = () => ({
  firstName: '',
  lastName: '',
  title: '',
  genre: '',
  language: 'English',
  status: 'unread',
  rating: 0,
  review: '',
  notes: '',
  favorite: false,
  quotes: [],
  dateAdded: new Date().toISOString().split('T')[0],
  dateStarted: '',
  dateFinished: '',
  pagesRead: '',
  totalPages: '',
});

export default function BookForm({ onAddBook, editingBook, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyBook);

  // Fill the form when editing; reset it when editing ends (cancel or update)
  useEffect(() => {
    setFormData(editingBook ? { ...emptyBook(), ...editingBook } : emptyBook());
  }, [editingBook]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.title.trim()) {
      alert('Please fill in author name and title');
      return;
    }
    onAddBook(formData);
    if (!editingBook) {
      setFormData(emptyBook());
    }
  };

  return (
    <div className="book-form">
      <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={formData.genre}
            onChange={handleChange}
          />
          <select name="language" value={formData.language} onChange={handleChange}>
            <option>English</option>
            <option>German</option>
            <option>Serbian</option>
            <option>Italian</option>
            <option>Other</option>
          </select>
        </div>

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="unread">Unread</option>
          <option value="reading">Reading</option>
          <option value="read">Read</option>
          <option value="dnf">DNF (Did Not Finish)</option>
        </select>

        {(formData.status === 'reading' || formData.status === 'read') && (
          <div className="form-row">
            <input
              type="date"
              name="dateStarted"
              value={formData.dateStarted}
              onChange={handleChange}
            />
            {formData.status === 'read' && (
              <input
                type="date"
                name="dateFinished"
                value={formData.dateFinished}
                onChange={handleChange}
              />
            )}
          </div>
        )}

        {formData.status === 'reading' && (
          <div className="form-row">
            <input
              type="number"
              name="pagesRead"
              placeholder="Pages read"
              min="0"
              value={formData.pagesRead}
              onChange={handleChange}
            />
            <input
              type="number"
              name="totalPages"
              placeholder="Total pages"
              min="0"
              value={formData.totalPages}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="rating-section">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star ${star <= formData.rating ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <textarea
          name="review"
          placeholder="Your review..."
          value={formData.review}
          onChange={handleChange}
          rows="4"
        />

        <textarea
          name="notes"
          placeholder="Personal notes..."
          value={formData.notes}
          onChange={handleChange}
          rows="3"
        />

        <label className="checkbox">
          <input
            type="checkbox"
            name="favorite"
            checked={formData.favorite}
            onChange={handleChange}
          />
          Favorite Book
        </label>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
          {editingBook && (
            <button type="button" className="btn-secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
