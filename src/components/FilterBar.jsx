import React from 'react';

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  sortBy,
  setSortBy,
  filteredCount
}) {
  return (
    <div className="filter-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search by author, title, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All Books</option>
          <option value="unread">Unread</option>
          <option value="reading">Currently Reading</option>
          <option value="read">Read</option>
          <option value="dnf">DNF</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
          <option value="dateAdded">Sort: Recently Added</option>
          <option value="title">Sort: Title</option>
          <option value="author">Sort: Author</option>
          <option value="rating">Sort: Rating</option>
          <option value="dateFinished">Sort: Date Finished</option>
        </select>
      </div>

      <p className="result-count">
        {filteredCount} {filteredCount === 1 ? 'book' : 'books'} shown
      </p>
    </div>
  );
}
