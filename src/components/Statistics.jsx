import React from 'react';

const countBy = (books, getKey) => {
  const counts = {};
  books.forEach(book => {
    const key = getKey(book);
    if (key) {
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
};

export default function Statistics({ books }) {
  const totalBooks = books.length;
  const countStatus = (status) => books.filter(b => b.status === status).length;
  const readBooks = countStatus('read');
  const readingBooks = countStatus('reading');
  const unreadBooks = countStatus('unread');
  const dnfBooks = countStatus('dnf');
  const favorites = books.filter(b => b.favorite).length;

  const ratedBooks = books.filter(b => b.rating > 0);
  const avgRating = ratedBooks.length > 0
    ? ratedBooks.reduce((sum, b) => sum + b.rating, 0) / ratedBooks.length
    : 0;

  const readPercentage = totalBooks > 0 ? ((readBooks / totalBooks) * 100).toFixed(1) : 0;

  const genreCount = countBy(books, b => b.genre && b.genre.trim());
  const languageCount = countBy(books, b => b.language);

  return (
    <div className="statistics">
      <h3>📊 Library Stats</h3>

      <div className="stat-box">
        <div className="stat-item">
          <span className="stat-label">Total Books</span>
          <span className="stat-value">{totalBooks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Read</span>
          <span className="stat-value">{readBooks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Reading</span>
          <span className="stat-value">{readingBooks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unread</span>
          <span className="stat-value">{unreadBooks}</span>
        </div>
      </div>

      <div className="stat-box">
        <div className="stat-item">
          <span className="stat-label">DNF</span>
          <span className="stat-value">{dnfBooks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Favorites</span>
          <span className="stat-value">⭐ {favorites}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Rating</span>
          <span className="stat-value">
            {ratedBooks.length > 0
              ? `${'★'.repeat(Math.round(avgRating))} ${avgRating.toFixed(1)}`
              : '–'}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">% Read</span>
          <span className="stat-value">{readPercentage}%</span>
        </div>
      </div>

      {Object.keys(genreCount).length > 0 && (
        <div className="breakdown">
          <h4>📚 By Genre</h4>
          <div className="genre-list">
            {Object.entries(genreCount).map(([genre, count]) => (
              <div key={genre} className="genre-item">
                <span>{genre}</span>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(languageCount).length > 0 && (
        <div className="breakdown">
          <h4>🗣️ By Language</h4>
          <div className="language-list">
            {Object.entries(languageCount).map(([lang, count]) => (
              <div key={lang} className="lang-item">
                <span>{lang}</span>
                <span className="count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
