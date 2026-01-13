# 📚 Library Navigation System

A simple, front-end–only library search system that helps users find books and see where they are located inside a library using a visual map.

This project is built with **HTML, CSS, and JavaScript only** — no backend required.

---

## ✨ Features

- 🔍 Search books by title
- 🧭 View book details and shelf location
- 🗺️ Genre-based library map display
- 🎛️ Filter books by genre (All, Fiction, Non-Fiction, Romance)
- 🔢 Active filter counter (e.g. `Filters • 2`)
- 🧠 Smart search ranking (starts-with results first)
- 🕘 Search history (last 5 searches)
- 🌙 Dark mode toggle
- 📱 Mobile-friendly UI
- 🛡️ Admin access (password-protected) to add books
- 💾 Data stored using `localStorage`

---

## 🧪 Demo Notes

- This is a **client-side project only**
- All data is stored in the browser via `localStorage`
- Refreshing the page will keep added books (unless browser data is cleared)

---

## 🔐 Admin Access

- Click the 🛡️ button (bottom-left)
- Password: `J`
- Admin panel allows adding new books:
  - Title
  - Author
  - Genre
  - Shelf number

---

## 🗂️ Project Structure

```text
.
├── index.html      # Main user interface
├── style.css       # Styles and layout
├── app.js          # Main logic (search, filters, UI)
├── database.js     # Default books + map references
├── admin.html      # Admin page
├── admin.js        # Admin logic (add books)
├── README.md
└── LICENSE
