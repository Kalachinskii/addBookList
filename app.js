const bookForm = document.querySelector('#book-form');
const bookList = document.querySelector('#book-list');
const title = document.querySelector('#title');
const author = document.querySelector('#author');
const isbn = document.querySelector('#isbn');

window.addEventListener('DOMContentLoaded', () => {
    const ui = new UI(); // что бы взять методы из UI
    const ls = new LS();
    const books = ls.getBooksFromLS();

    for (const book of books) {
        ui.addBookToList(book);
    }
})

bookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let titleVal = title.value, 
        authorVal = author.value,
        isbnVal = isbn.value;
    const ui = new UI();
    const ls = new LS();

    if (!titleVal || !authorVal || !isbnVal) {
        ui.showMessage('Проверь поля ввода', 'danger');
    } else {
        ui.showMessage('Все ОК', 'success'); 
        const book = new Book(titleVal, authorVal, isbnVal);
        ls.addBookToLS(book);
        ui.addBookToList(book);
        ui.clearFields();
    }
});

bookList.addEventListener('click', function (event) {
    if (event.target.matches('.del')) {
        const ui = new UI(); // что бы взять методы из UI
        const ls = new LS();
        const isbn = event.target.parentElement.previousElementSibling.textContent;

        ls.deleteBookFromLS(isbn);
        ui.deleteBookFromList(event.target.closest('tr'));
    }
})

class Book {
    constructor (title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI - Юзер интерфейс перенаправления (контроллер)
class UI { 
    addBookToList(book) {
        bookList.insertAdjacentHTML('beforeend', 
        `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><button type="button" class="btn btn-outline-danger del">х</button></td>
        </tr>`)
    }

    clearFields () {
        title.value = '';
        author.value = '';
        isbn.value = '';
    }

    deleteBookFromList(book) {
        book.remove();
    }

    showMessage(message, color) {
        bookForm.insertAdjacentHTML('beforebegin', `<div class="alert alert-${color}" role="alert"> ${message} </div>`);

        setTimeout(() => {document.querySelector('.alert').remove()}, 2000);
    }
}

class LS {
    addBookToLS (book) {
        // внутри класса к чему то обращаемся через this
        let books = this.getBooksFromLS(); // получить с ЛС
        books.push(book); // записать новый объект
        this.setItemToLS(books);
    }

    deleteBookFromLS(isbn) { // плохо при повторе isbn
        let books = this.getBooksFromLS();
        books.forEach((book, ind) => {
            if (book.isbn == isbn) {
                books.splice(ind, 1);
            }
            this.setItemToLS(books);
        });
    }

    getBooksFromLS() {
        return JSON.parse(localStorage.getItem('books')) || [];
    }

    setItemToLS(books) {
        localStorage.setItem('books', JSON.stringify(books));
    }
}







