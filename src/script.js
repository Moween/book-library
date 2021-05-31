const newBookBtn = document.querySelector('#newbook');
const submitBtn = document.querySelector('#form');
const bookTitleInput = document.querySelector('#book-title');
const bookAuthorInput = document.querySelector('#book-author');
const numOfPagesInput = document.querySelector('#num-of-pages');
const booksContainer = document.querySelector('#books-container');

let bookArrayCopy = localStorage.getItem('books');
// A copy of local Storage data
if (bookArrayCopy) {
  bookArrayCopy = JSON.parse(bookArrayCopy);
} else {
  bookArrayCopy = [];
  // Set local storage
  localStorage.setItem('books', JSON.stringify([]));
}

newBookBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const formContainer = document.querySelector('.form-container');
  if (formContainer.style.display === 'none') {
    formContainer.style.display = 'block';
  } else {
    formContainer.style.display = 'none';
  }
});

const clearInput = (e) => {
  e.preventDefault();
  document.querySelector(`#${e.target.id}`).value = '';
};

class Book {
  constructor() {
    this.title = document.querySelector('#book-title').value;
    this.author = document.querySelector('#book-author').value;
    this.numberOfPages = document.querySelector('#num-of-pages').value;
    this.id = Date.now();
  }
}

const handleAddBook = (e) => {
  e.preventDefault();
  clearInput(e);
  const book = new Book();
  const {
    title, author, numberOfPages, id,
  } = book;

  let booksArray = localStorage.getItem('books');
  if (booksArray) {
    booksArray = JSON.parse(booksArray);
  }
  booksArray.push({
    title, author, numberOfPages, id,
  });
  bookArrayCopy = [...booksArray];
  // Set Local Storage
  localStorage.setItem('books', JSON.stringify(booksArray));
  displayBooks();
};

class BookCover {
  constructor(book) {
    this.card = document.createElement('div');
    this.className = 'book-card';
    const h04 = `${book.title}`;
    const pElem = document.createElement('p');
    pElem.textContent = `${book.author}`;
    const pElem2 = document.createElement('p');
    pElem2.textContent = `${book.numberOfPages}`;
    this.card.append(h04, pElem, pElem2);
    this.deleteBtn = document.createElement('button');
    this.deleteBtn.className = 'btn btn-xs btn-danger delete';
    this.deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    this.deleteBtn.onclick = handleDeleteBooks;
    this.readBtn = document.createElement('button');
    this.readBtn.className = 'btn btn-xs btn-success read-btn';
    this.readBtn.textContent = 'Read';
    this.readBtn.onclick = handleReadBooks;
  }
}

class LibraryLog {
  constructor(book) {
    this.table = document.createElement('table');
    this.table.className = 'table';
    const tableCaption = document.createElement('caption');
    tableCaption.textContent = 'Library Log';
    for (let i = 0; i <= 2; i += 1) {
      const tableRow = document.createElement('tr');
      const tableHeading = document.createElement('th');
      const tableData = document.createElement('td');
      switch (i) {
        case 0:
          tableHeading.textContent = 'Total Books';
          tableData.textContent = `${bookArrayCopy.length}`;
          break;
        case 1:
          tableHeading.textContent = 'Read';
          tableData.textContent = `${bookArrayCopy.filter((book) => book.read).length}`;
          break;
        case 2:
          tableHeading.textContent = 'Not Read';
          tableData.textContent = `${bookArrayCopy.filter((book) => !(book.read)).length}`;
          break;
        default:
          tableHeading.textContent = 'Nothing';
      }
      tableRow.append(tableHeading, tableData);
      this.table.append(tableCaption, tableRow);
    }
  }
}

const displayBooks = () => {
  booksContainer.innerHTML = '';
  bookArrayCopy.forEach((book) => {
    const mybook = new BookCover(book);
    const { card, deleteBtn, readBtn } = mybook;
    deleteBtn.setAttribute('data-id', book.id);
    readBtn.setAttribute('data-id', book.id);
    card.append(readBtn, deleteBtn);
    booksContainer.append(card);
  });
  const lib = new LibraryLog();
  booksContainer.append(lib.table);
};

const handleDeleteBooks = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { currentTarget: { dataset: { id: deleteBook } } } = e;

  let booksArray = localStorage.getItem('books');
  booksArray = JSON.parse(booksArray);
  // Deletes a book from the localStorage
  booksArray = booksArray.filter((book) => book.id !== Number(deleteBook));
  // Spread new books Array after delete to the booksArrayCopy
  bookArrayCopy = [...booksArray];
  // Resets local storage
  localStorage.setItem('books', JSON.stringify(booksArray));
  // Delete From DOM
  displayBooks();
};

const handleReadBooks = (e) => {
  e.preventDefault();
  e.stopPropagation();
  const {target: {dataset: {id: readBook}}} = e;

  let booksArray =  localStorage.getItem('books');
  booksArray = JSON.parse(booksArray);

  // Adss a read key to the localStorage Data
  booksArray.forEach(book => {
    if(book.id === Number(readBook)) {
      book.read = true;
    }
  })
  // Spread new books Array after to the booksArrayCopy
  bookArrayCopy = [...booksArray];
  // Resets local storage
  localStorage.setItem('books', JSON.stringify(booksArray));
  displayBooks();
}

displayBooks();
submitBtn.addEventListener('submit', handleAddBook);
bookTitleInput.addEventListener('click', clearInput);
bookAuthorInput.addEventListener('click', clearInput);
numOfPagesInput.addEventListener('click', clearInput);