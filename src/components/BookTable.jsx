import React, { useState } from 'react';

const STATUS_ICONS = { reading: '📖', read: '✓', unread: '○', dnf: '✗' };
const STATUS_LABELS = { reading: 'Reading', read: 'Read', unread: 'Unread', dnf: 'DNF' };
const COLUMN_COUNT = 9;

const truncate = (text = '', max = 50) =>
  text.length > max ? `${text.substring(0, max)}...` : text;

function ReviewPanel({ book }) {
  return (
    <div className="detail-panel">
      <h4>📝 Review — {book.title}</h4>
      {book.review && book.review.trim() ? (
        <p className="detail-review">{book.review}</p>
      ) : (
        <p className="detail-empty">No review yet. Use Edit to write one.</p>
      )}
    </div>
  );
}

function QuotesPanel({ book, onUpdate }) {
  const [text, setText] = useState('');
  const [page, setPage] = useState('');
  const quotes = book.quotes || [];

  const addQuote = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const quote = { id: Date.now(), text: text.trim(), page: page.trim() };
    onUpdate(book.id, { quotes: [...quotes, quote] });
    setText('');
    setPage('');
  };

  const removeQuote = (id) => {
    onUpdate(book.id, { quotes: quotes.filter(q => q.id !== id) });
  };

  return (
    <div className="detail-panel">
      <h4>❝ Favorite quotes — {book.title}</h4>
      {quotes.length === 0 ? (
        <p className="detail-empty">No quotes saved yet.</p>
      ) : (
        <ul className="quote-list">
          {quotes.map(q => (
            <li key={q.id} className="quote-item">
              <span className="quote-text">
                “{q.text}”
                {q.page && <span className="quote-page">p. {q.page}</span>}
              </span>
              <button
                type="button"
                className="quote-remove"
                title="Remove quote"
                onClick={() => removeQuote(q.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <form className="quote-form" onSubmit={addQuote}>
        <input
          type="text"
          placeholder="Add a favorite quote..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Page (optional)"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
        <button type="submit" className="btn-primary">Add</button>
      </form>
    </div>
  );
}

export default function BookTable({ books, onDelete, onEdit, onUpdate }) {
  // Which book has an open panel, and which panel ('review' or 'quotes')
  const [open, setOpen] = useState(null);

  const togglePanel = (id, panel) => {
    setOpen(prev => (prev && prev.id === id && prev.panel === panel ? null : { id, panel }));
  };

  const isOpen = (id, panel) => open && open.id === id && open.panel === panel;

  return (
    <div className="table-container">
      {books.length === 0 ? (
        <p className="no-books">No books found. Start building your library!</p>
      ) : (
        <table className="books-table">
          <thead>
            <tr>
              <th>★</th>
              <th>Author</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Language</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <React.Fragment key={book.id}>
                <tr className={`book-row ${book.favorite ? 'favorite' : ''}`}>
                  <td>{book.favorite ? '★' : ''}</td>
                  <td>{book.lastName}, {book.firstName}</td>
                  <td>{book.title}</td>
                  <td>{book.genre}</td>
                  <td>{book.language}</td>
                  <td>
                    <span className={`status status-${book.status}`}>
                      {STATUS_ICONS[book.status]}{' '}
                      {STATUS_LABELS[book.status] || book.status}
                      {book.status === 'read' && book.dateFinished &&
                        ` (${new Date(book.dateFinished).toLocaleDateString()})`}
                    </span>
                  </td>
                  <td>{'★'.repeat(book.rating || 0)}</td>
                  <td className="review-cell">{truncate(book.review)}</td>
                  <td className="actions">
                    <button
                      className={`btn-small btn-review ${isOpen(book.id, 'review') ? 'active' : ''}`}
                      onClick={() => togglePanel(book.id, 'review')}
                    >
                      Review
                    </button>
                    <button
                      className={`btn-small btn-quotes ${isOpen(book.id, 'quotes') ? 'active' : ''}`}
                      onClick={() => togglePanel(book.id, 'quotes')}
                    >
                      Quotes{book.quotes && book.quotes.length > 0 ? ` (${book.quotes.length})` : ''}
                    </button>
                    <button className="btn-small btn-edit" onClick={() => onEdit(book)}>
                      Edit
                    </button>
                    <button className="btn-small btn-delete" onClick={() => {
                      if (window.confirm('Delete this book?')) {
                        onDelete(book.id);
                      }
                    }}>
                      Delete
                    </button>
                  </td>
                </tr>
                {open && open.id === book.id && (
                  <tr className="detail-row">
                    <td colSpan={COLUMN_COUNT}>
                      {open.panel === 'review'
                        ? <ReviewPanel book={book} />
                        : <QuotesPanel book={book} onUpdate={onUpdate} />}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
