const newBookBtn = document.querySelector('#newbook');
const submitBtn = document.querySelector('#form');
const bookTitleInput = document.querySelector('#book-title');
const bookAuthorInput = document.querySelector('#book-author');
const numOfPagesInput = document.querySelector('#num-of-pages');
const readInput = document.querySelector('#read');
const booksContainer = document.querySelector('#books-container');
let clicked = false;  
  


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
  console.log(e.target)
  const formContainer = document.querySelector('.form-container');
  formContainer.style.display = 
    (formContainer.style.display === 'block' ? 'none': 'block');  
});

const clearInput = (e) => {
  e.preventDefault();
  document.querySelector(`#${e.target.id}`).value = '';
};

class Book {
  constructor(book) {
    this.title = book.title;
    this.author = book.author;
    this.numberOfPages = book.numberOfPages;
    this.id = book.id;
    this.readStatus = book.readStatus;
  }
}

const handleSubmit = (e) => {
  e.preventDefault();
  clearInput(e);
  const newBook = {};
  newBook.title = e.target['book-title'].value;
  newBook.author = e.target['book-author'].value;
  newBook.numberOfPages = e.target['num-of-pages'].value;
  newBook.id = Date.now().toString();
  newBook.readStatus = e.target['read'].value;

  const book = new Book(newBook);

  let booksArray = localStorage.getItem('books');
  booksArray = JSON.parse(booksArray);
  
  booksArray.push({
    title, author, numberOfPages, id, readStatus
  } = book);

  bookArrayCopy = [...booksArray];
  // Set Local Storage
  localStorage.setItem('books', JSON.stringify(booksArray));
  displayBooks();
};

class BookCover {
  constructor(book) {
    this.card = document.createElement('div');
    this.card.className = 'book-card';
    const h04 = document.createElement('h4'); 
    h04.innerHTML = `Title: <cite> ${book.title}</cite>`
    h04.className = 'book-title';
    const pElem = document.createElement('p');
    pElem.textContent = `Author: ${book.author}`;
    pElem.className = 'book-author';
    const pElem2 = document.createElement('p');
    pElem2.textContent = `${book.numberOfPages} pages`;
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-sm btn-danger delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = this.handleDeleteBooks;
    deleteBtn.setAttribute('data-id', book.id);
    const readBtn = document.createElement('button');
    readBtn.setAttribute('data-id', book.id);
    readBtn.className = 'btn btn-sm btn-success read-btn';
    readBtn.textContent = 'Read';
    readBtn.onclick = this.toggleRead;
    this.card.append(
      h04, pElem, pElem2, readBtn, deleteBtn
    );
    this.handleDeleteBooks = this.handleDeleteBooks.bind(this);
    this.toggleRead = this.toggleRead.bind(this);
  }

  handleDeleteBooks = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { currentTarget: { dataset: { id: deleteBook } } } = e;
  
    let booksArray = localStorage.getItem('books');
    booksArray = JSON.parse(booksArray);
    // Deletes a book from the localStorage
    booksArray = booksArray.filter((book) => book.id !== deleteBook);
    // Spread new books Array after delete to the booksArrayCopy
    bookArrayCopy = [...booksArray];
    // Resets local storage
    localStorage.setItem('books', JSON.stringify(booksArray));
    // Update DOM
    displayBooks();
  };
  
  toggleRead = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {target: {dataset: {id: book_id}}} = e;
  
    let booksArray =  localStorage.getItem('books');
    booksArray = JSON.parse(booksArray);
  
    // Adss a read key to the localStorage Data
    booksArray = booksArray.map(book => {
      if(book.id === book_id) {
        book.readStatus = (book.readStatus === true ? false : true);
      }
      return book;
    })
    // Spread new books Array after to the booksArrayCopy
    bookArrayCopy = [...booksArray];
    // Resets local storage
    localStorage.setItem('books', JSON.stringify(booksArray));
    displayBooks();
  }
}

class LibraryLog {
  constructor() {
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
          tableData.textContent = `${bookArrayCopy.filter(book => book.readStatus === String(true)).length}`;
          break;
        case 2:
          tableHeading.textContent = 'Not Read';
          tableData.textContent = `${bookArrayCopy.filter(book => book.readStatus === String(false)).length}`;
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
  bookArrayCopy.forEach(newBook => {
    const mybook = new BookCover(newBook);
    const { card } = mybook;
    booksContainer.append(card);
  });
  if(!bookArrayCopy.length) {
    document.querySelector('.table-container').style.display = 'none';
  }else {
    const lib = new LibraryLog();
    const { table } = lib;
    document.querySelector('.table-container').style.display = 'block';
    document.querySelector('.table-container').innerHTML = '';
    document.querySelector('.table-container').append(table);
  }
};

displayBooks();
submitBtn.addEventListener('submit', handleSubmit);
bookTitleInput.addEventListener('click', clearInput);
bookAuthorInput.addEventListener('click', clearInput);
readInput.addEventListener('click', clearInput);
numOfPagesInput.addEventListener('click', clearInput);