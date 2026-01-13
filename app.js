const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const noResults = document.getElementById("noResults");
const historyBox = document.getElementById("history");

const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const filterAll = document.getElementById("filterAll");

const bookOverlay = document.getElementById("bookOverlay");
const closeBook = document.getElementById("closeBook");

const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookShelf = document.getElementById("bookShelf");
const mapImage = document.getElementById("mapImage");
const genreChip = document.getElementById("genreChip");

const themeToggle = document.getElementById("themeToggle");
const adminBtn = document.getElementById("adminBtn");
const adminOverlay = document.getElementById("adminOverlay");
const closeAdmin = document.getElementById("closeAdmin");
const adminEnter = document.getElementById("adminEnter");
const adminPassword = document.getElementById("adminPassword");
const adminError = document.getElementById("adminError");

const hero = document.getElementById("hero");
const searchWrapper = document.getElementById("searchWrapper");

let hasSearched = false;
let BOOKS = JSON.parse(localStorage.getItem("books")) || DEFAULT_BOOKS;
let history = JSON.parse(localStorage.getItem("history")) || [];

/* =========================
   FILTER DROPDOWN
========================= */
filterToggle.onclick = () => {
  filterPanel.classList.toggle("filter-hidden");
};

document.addEventListener("click", e => {
  if (!filterPanel.contains(e.target) && !filterToggle.contains(e.target)) {
    filterPanel.classList.add("filter-hidden");
  }
});

/* =========================
   THEME
========================= */
function updateThemeIcon() {
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
  updateThemeIcon();
};

if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark");
}
updateThemeIcon();

/* =========================
   ADMIN
========================= */
adminBtn.onclick = () => adminOverlay.classList.add("show");
closeAdmin.onclick = () => adminOverlay.classList.remove("show");

adminEnter.onclick = () => {
  if (adminPassword.value === "J") {
    window.location.href = "admin.html";
  } else {
    adminError.textContent = "Incorrect password";
  }
};

/* =========================
   SEARCH HISTORY
========================= */
function saveHistory(q) {
  history = history.filter(h => h !== q);
  history.unshift(q);
  history = history.slice(0, 5);
  localStorage.setItem("history", JSON.stringify(history));
}

function renderHistory() {
  historyBox.innerHTML = "";
  if (searchInput.value) return;
  
  history.forEach(h => {
    const d = document.createElement("div");
    d.className = "history-item";
    d.textContent = h;
    d.onclick = () => {
      searchInput.value = h;
      runSearch();
    };
    historyBox.appendChild(d);
  });
}

searchInput.addEventListener("focus", renderHistory);

/* =========================
   FILTER LOGIC (FIXED)
========================= */
filterAll.addEventListener("change", () => {
  if (filterAll.checked) {
    filterPanel
      .querySelectorAll('input[type="checkbox"]:not(#filterAll)')
      .forEach(cb => (cb.checked = false));
  }
  runSearch();
});

filterPanel.addEventListener("change", () => {
  const checkedGenres = [...filterPanel.querySelectorAll(
    'input[type="checkbox"]:not(#filterAll)'
  )].filter(cb => cb.checked);
  
  if (checkedGenres.length > 0) {
    filterAll.checked = false;
  } else {
    filterAll.checked = true;
  }
  
  runSearch();
});

/* =========================
   SEARCH (FIXED)
========================= */
searchInput.addEventListener("input", runSearch);

function runSearch() {
  results.innerHTML = "";
  noResults.textContent = "";
  historyBox.innerHTML = "";
  
  const q = searchInput.value.toLowerCase();
  
  if (!hasSearched && q) {
    hasSearched = true;
    hero.classList.add("hidden");
    searchWrapper.classList.add("move-up");
  }
  
  let genres = [];
  filterPanel.querySelectorAll("input[type=checkbox]").forEach(cb => {
    if (cb.checked && cb !== filterAll) genres.push(cb.value);
  });
  
  if (filterAll.checked || !genres.length) {
    genres = ["Fiction", "Non-Fiction", "Romance"];
  }
  
  const matches = BOOKS
    .filter(b =>
      genres.includes(b.genre) &&
      (!q || b.title.toLowerCase().includes(q))
    )
    .sort((a, b) =>
      q ?
      b.title.toLowerCase().startsWith(q) -
      a.title.toLowerCase().startsWith(q) :
      0
    );
  
  if (!matches.length) {
    noResults.textContent = q ?
      `No ${genres.join(", ")} books match "${searchInput.value}"` :
      `No books found`;
    return;
  }
  
  if (q) saveHistory(q);
  
  matches.forEach(b => {
    const d = document.createElement("div");
    d.className = "result-item";
    d.innerHTML = `<strong>${b.title}</strong><br><small>${b.author}</small>`;
    d.onclick = () => openBook(b);
    results.appendChild(d);
  });
}

/* =========================
   BOOK MODAL
========================= */
function openBook(book) {
  bookTitle.textContent = book.title;
  bookAuthor.textContent = "Author: " + book.author;
  bookShelf.textContent = "Shelf: " + book.shelf;
  genreChip.textContent = book.genre;
  mapImage.src = MAPS[book.genre];
  
  bookOverlay.classList.add("show");
  
  genreChip.onclick = () => {
    filterAll.checked = false;
    filterPanel.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.checked = cb.value === book.genre;
    });
    bookOverlay.classList.remove("show");
    runSearch();
  };
}

closeBook.onclick = () => bookOverlay.classList.remove("show");
