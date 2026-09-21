import React, { useState, useEffect } from 'react';
import './App.css';
import BookForm from './components/BookForm';
import BookTable from './components/BookTable';
import Statistics from './components/Statistics';
import FilterBar from './components/FilterBar';

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  // Lazy initializers read localStorage before the first render, so the save
  // effects below can never overwrite stored data with an empty default.
  const [books, setBooks] = useState(() => loadFromStorage('bookLibrary', []));
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [darkMode, setDarkMode] = useState(() => loadFromStorage('darkMode', false));
  const [editingBook, setEditingBook] = useState(null);

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookLibrary', JSON.stringify(books));
  }, [books]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addBook = (book) => {
    if (editingBook) {
      // Keep the stored quotes: they can change while the edit form is open
      setBooks(books.map(b => b.id === editingBook.id ? { ...book, id: editingBook.id, quotes: b.quotes || [] } : b));
      setEditingBook(null);
    } else {
      setBooks([...books, { ...book, id: Date.now() }]);
    }
  };

  const updateBook = (id, changes) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...changes } : b));
  };

  // Backup: share/save the library as a JSON file
  const exportBooks = async () => {
    const fileName = `book-library-${new Date().toISOString().split('T')[0]}.json`;
    const file = new File([JSON.stringify(books, null, 2)], fileName, { type: 'application/json' });

    // On iPhone the share sheet offers "Save to Files", AirDrop, etc.
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'My Book Library backup' });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Restore: add new books and update ones with the same id
  const importBooks = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());
      const valid = Array.isArray(imported) &&
        imported.every(b => b && typeof b === 'object' && b.id && b.title);
      if (!valid) throw new Error('Invalid backup file');

      if (!window.confirm(`Import ${imported.length} book(s)? Books already in your library are updated, new ones are added.`)) {
        return;
      }

      setBooks(prev => {
        const byId = new Map(prev.map(b => [b.id, b]));
        imported.forEach(b => byId.set(b.id, b));
        return [...byId.values()];
      });
    } catch {
      alert('Could not read this file. Please choose a backup exported from this app.');
    }
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
    if (editingBook && editingBook.id === id) {
      setEditingBook(null);
    }
  };

  const startEdit = (book) => {
    setEditingBook(book);
  };

  const cancelEdit = () => {
    setEditingBook(null);
  };

  // Filter and search logic
  const term = searchTerm.toLowerCase();
  const filteredBooks = books.filter(book => {
    const matchesFilter = filter === 'all' || book.status === filter;

    const matchesSearch = [book.firstName, book.lastName, book.title, book.genre]
      .some(field => (field || '').toLowerCase().includes(term));

    return matchesFilter && matchesSearch;
  });

  // Sort logic
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return a.lastName.localeCompare(b.lastName);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'dateAdded':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case 'dateFinished':
        return new Date(b.dateFinished || 0) - new Date(a.dateFinished || 0);
      default:
        return 0;
    }
  });

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>📚 My Book Library</h1>
          <div className="header-actions">
            <button className="header-btn" onClick={exportBooks} disabled={books.length === 0}>
              ⬇ Export
            </button>
            <label className="header-btn">
              ⬆ Import
              <input type="file" accept="application/json,.json" onChange={importBooks} hidden />
            </label>
            <button
              className="dark-mode-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="sidebar">
          <BookForm
            onAddBook={addBook}
            editingBook={editingBook}
            onCancelEdit={cancelEdit}
          />
          <Statistics books={books} />
        </div>

        <div className="content">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredCount={sortedBooks.length}
          />
          <BookTable
            books={sortedBooks}
            onDelete={deleteBook}
            onEdit={startEdit}
            onUpdate={updateBook}
          />
        </div>
      </main>
    </div>
  );
}
