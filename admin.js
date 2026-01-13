const title = document.getElementById("title");
const author = document.getElementById("author");
const genre = document.getElementById("genre");
const shelf = document.getElementById("shelf");
const addBook = document.getElementById("addBook");

let books = JSON.parse(localStorage.getItem("books")) || DEFAULT_BOOKS;

addBook.onclick = () => {
  if (!title.value || !author.value || !shelf.value) {
    alert("Fill all fields");
    return;
  }
  
  books.push({
    title: title.value,
    author: author.value,
    genre: genre.value,
    shelf: shelf.value
  });
  
  localStorage.setItem("books", JSON.stringify(books));
  alert("Book added!");
};