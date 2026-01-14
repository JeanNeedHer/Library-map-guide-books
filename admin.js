document.addEventListener("DOMContentLoaded", () => {
  
  // 🌙 DARK MODE SYNC
  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
  }
  
  // 📚 DATA
  let books = JSON.parse(localStorage.getItem("books")) || DEFAULT_BOOKS;
  
  // Save default books to localStorage if empty
  if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify(DEFAULT_BOOKS));
  }
  
  // 🧩 ELEMENTS
  const addModal = document.getElementById("addModal");
  const manageModal = document.getElementById("manageModal");
  const statsModal = document.getElementById("statsModal");
  
  const btnAdd = document.getElementById("openAdd");
  const btnManage = document.getElementById("openManage");
  const btnStats = document.getElementById("openStats");
  
  // 🪟 OPEN MODALS
  btnAdd.onclick = () => open(addModal);
  
  btnManage.onclick = () => {
    renderBooks();
    open(manageModal);
  };
  
  btnStats.onclick = () => {
    updateStats();
    open(statsModal);
  };
  
  // ❌ CLOSE MODALS
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.onclick = () => {
      btn.closest(".overlay").classList.remove("show");
    };
  });
  
  function open(modal) {
    modal.classList.add("show");
  }
  
  // ➕ ADD BOOK
  document.getElementById("addBook").onclick = () => {
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const genre = document.getElementById("genre");
    const shelf = document.getElementById("shelf");
    const msg = document.getElementById("adminMsg");
    
    if (!title.value || !author.value || !shelf.value) {
      msg.textContent = "Fill all fields";
      msg.style.color = "red";
      return;
    }
    
    books.push({
      title: title.value,
      author: author.value,
      genre: genre.value,
      shelf: shelf.value
    });
    
    localStorage.setItem("books", JSON.stringify(books));
    
    msg.textContent = "Book added!";
    msg.style.color = "green";
    
    title.value = "";
    author.value = "";
    shelf.value = "";
  };
  
  // 📚 MANAGE BOOKS
  const bookList = document.getElementById("bookList");
  const adminSearch = document.getElementById("adminSearch");
  
  adminSearch.oninput = renderBooks;
  
  function renderBooks() {
    bookList.innerHTML = "";
    const q = adminSearch.value.toLowerCase();
    
    books
      .filter(b => b.title.toLowerCase().includes(q))
      .forEach((b, i) => {
        const row = document.createElement("div");
        row.className = "admin-book-row";
        row.innerHTML = `
          <div>
            <strong>${b.title}</strong><br>
            <small>${b.author} • ${b.genre} • ${b.shelf}</small>
          </div>
          <button onclick="deleteBook(${i})">🗑️</button>
        `;
        bookList.appendChild(row);
      });
  }
  
  window.deleteBook = i => {
    if (!confirm("Delete this book?")) return;
    books.splice(i, 1);
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
  };
  
  // 📊 STATS
  function updateStats() {
    document.getElementById("statTotal").textContent = books.length;
    document.getElementById("statFiction").textContent =
      books.filter(b => b.genre === "Fiction").length;
    document.getElementById("statNonFiction").textContent =
      books.filter(b => b.genre === "Non-Fiction").length;
    document.getElementById("statRomance").textContent =
      books.filter(b => b.genre === "Romance").length;
  }
  
});
