let books = JSON.parse(localStorage.getItem("books")) || DEFAULT_BOOKS;

addBook.onclick = () => {
  if (!title.value || !author.value || !shelf.value) {
    adminMsg.textContent = "Please fill in all fields.";
    adminMsg.style.color = "red";
    return;
  }

  books.push({
    title: title.value,
    author: author.value,
    genre: genre.value,
    shelf: shelf.value
  });

  localStorage.setItem("books", JSON.stringify(books));

  adminMsg.textContent = "Book added successfully!";
  adminMsg.style.color = "green";

  title.value = "";
  author.value = "";
  shelf.value = "";
};
