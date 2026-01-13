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

let BOOKS = JSON.parse(localStorage.getItem("books")) || DEFAULT_BOOKS;
let history = JSON.parse(localStorage.getItem("history")) || [];

filterToggle.onclick = () => {
  filterPanel.classList.toggle("filter-hidden");
}; 

function updateThemeIcon() {
  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "dark",
    document.body.classList.contains("dark")
  );
  updateThemeIcon();
};

if (localStorage.getItem("dark")==="true") {
  document.body.classList.add("dark");
}

adminBtn.onclick = () => adminOverlay.classList.add("show");
closeAdmin.onclick = () => adminOverlay.classList.remove("show");

adminEnter.onclick = () => {
  if (adminPassword.value === "J") {
    window.location.href = "admin.html";
  } else {
    adminError.textContent = "Incorrect password";
  }
};

searchInput.addEventListener("input", runSearch);
filterPanel.addEventListener("change", runSearch);

function saveHistory(q){
  history = history.filter(h=>h!==q);
  history.unshift(q);
  history = history.slice(0,5);
  localStorage.setItem("history",JSON.stringify(history));
}

function renderHistory(){
  historyBox.innerHTML="";
  if(searchInput.value) return;
  history.forEach(h=>{
    const d=document.createElement("div");
    d.className="history-item";
    d.textContent=h;
    d.onclick=()=>{searchInput.value=h;runSearch();};
    historyBox.appendChild(d);
  });
}

searchInput.addEventListener("focus",renderHistory);

function runSearch(){
  results.innerHTML="";
  noResults.textContent="";
  historyBox.innerHTML="";

  const q=searchInput.value.toLowerCase();
  if(!q) return;

  saveHistory(q);

  let genres=[];
  document.querySelectorAll('#filterPanel input[type=checkbox]').forEach(cb=>{
    if(cb.checked && cb!==filterAll) genres.push(cb.value);
  });
  if(filterAll.checked || !genres.length){
    genres=["Fiction","Non-Fiction","Romance"];
  }

  const matches=BOOKS
    .filter(b=>b.title.toLowerCase().includes(q)&&genres.includes(b.genre))
    .sort((a,b)=>b.title.toLowerCase().startsWith(q)-a.title.toLowerCase().startsWith(q));

  if(!matches.length){
    noResults.textContent=`No ${genres.join(", ")} books match "${searchInput.value}"`;
    return;
  }

  matches.forEach(b=>{
    const d=document.createElement("div");
    d.className="result-item";
    d.innerHTML=`<strong>${b.title}</strong><br><small>${b.author}</small>`;
    d.onclick=()=>openBook(b);
    results.appendChild(d);
  });
}

function openBook(book){
  bookTitle.textContent=book.title;
  bookAuthor.textContent="Author: "+book.author;
  bookShelf.textContent="Shelf: "+book.shelf;
  genreChip.textContent=book.genre;
  mapImage.src=MAPS[book.genre];
  bookOverlay.classList.add("show");

  genreChip.onclick=()=>{
    filterAll.checked=false;
    document.querySelectorAll('#filterPanel input').forEach(cb=>{
      cb.checked=cb.value===book.genre;
    });
    bookOverlay.classList.remove("show");
    runSearch();
  };
}

closeBook.onclick=()=>bookOverlay.classList.remove("show");


// Clicking "All" clears others
filterAll.addEventListener("change", () => {
  if (filterAll.checked) {
    filterPanel
      .querySelectorAll('input[type="checkbox"]:not(#filterAll)')
      .forEach(cb => cb.checked = false);
  }

  updateFilterBadge();
  runSearch();
});

document.addEventListener("DOMContentLoaded", () => {
  filterPanel.classList.add("filter-hidden");
});

document.addEventListener("click", (e) => {
  const isFilterButton = filterToggle.contains(e.target);
  const isFilterPanel = filterPanel.contains(e.target);

  if (!isFilterButton && !isFilterPanel) {
    filterPanel.classList.add("filter-hidden");
  }
});

function updateFilterBadge() {
  const checked = filterPanel.querySelectorAll(
    'input[type="checkbox"]:checked:not(#filterAll)'
  ).length;

  filterToggle.textContent = checked > 0
    ? `Filters • ${checked} ▾`
    : `Filters ▾`;
}

filterPanel.addEventListener("change", () => {
  const genreCheckboxes = filterPanel.querySelectorAll(
    'input[type="checkbox"]:not(#filterAll)'
  );
  
  const checkedGenres = [...genreCheckboxes].filter(cb => cb.checked);
  
  // If a genre is selected → uncheck All
  if (checkedGenres.length > 0) {
    filterAll.checked = false;
  }
  
  // If none selected → default back to All
  if (checkedGenres.length === 0) {
    filterAll.checked = true;
  }
  
  updateFilterBadge();
  runSearch();
});

updateFilterBadge();

if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark");
}

updateThemeIcon();
