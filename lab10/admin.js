const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const feedbackList = document.getElementById('feedback-list');
const bookFilter = document.getElementById('feedback-book-filter');
const userFilter = document.getElementById('feedback-user-filter');
const submitBookBtn = document.getElementById('submit-book');
const cancelEditBtn = document.getElementById('cancel-edit');
let currentUser = null;
let editingBookId = null;

// Load current user
function loadUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        if (currentUser.role !== 'admin') {
            alert('Access denied. Admins only.');
            window.location.href = 'index.html';
        }
        document.querySelector('.admin-link').style.display = 'inline-block';
    } else {
        alert('Please log in as an admin.');
        window.location.href = 'register.html';
    }
}

// Fetch books from localStorage
async function fetchBooks() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        const books = data.books;
        renderBooks(books);
        populateBookFilter(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        bookList.innerHTML = '<p class="no-books">Error loading books.</p>';
    }
}

// Render books
function renderBooks(books) {
    bookList.innerHTML = '';
    if (books.length === 0) {
        bookList.innerHTML = '<p class="no-books">No books found.</p>';
        return;
    }
    books.forEach(book => {
        const bookItem = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="book-card">
                    <img src="public/images/${book.image || 'placeholder.jpg'}" alt="${book.title}" class="book-img">
                    <div class="book-info">
                        <h3 class="title title-xs">${book.title}</h3>
                        <p class="desc desc-sm">${book.author}</p>
                        <p class="desc desc-sm desc-yellow">$${book.price.toFixed(2)}</p>
                        <button class="button edit-book" data-id="${book.id}">Edit</button>
                        <button class="button delete-book" data-id="${book.id}">Delete</button>
                    </div>
                </div>
            </div>
        `;
        bookList.innerHTML += bookItem;
    });
}

// Populate book filter
function populateBookFilter(books) {
    bookFilter.innerHTML = '<option value="">All Books</option>';
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = book.title;
        bookFilter.appendChild(option);
    });
}

// Populate user filter from localStorage
async function populateUserFilter() {
    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        userFilter.innerHTML = '<option value="">All Users</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.username;
            userFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Fetch feedback from localStorage
async function fetchFeedback() {
    try {
        const bookId = bookFilter.value;
        const userId = userFilter.value;
        let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
        
        if (bookId && userId) {
            feedback = feedback.filter(f => f.bookId == bookId && f.userId == userId);
        } else if (bookId) {
            feedback = feedback.filter(f => f.bookId == bookId);
        } else if (userId) {
            feedback = feedback.filter(f => f.userId == userId);
        }
        
        renderFeedback(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        feedbackList.innerHTML = '<p class="no-books">Error loading feedback.</p>';
    }
}

// Render feedback
async function renderFeedback(feedback) {
    feedbackList.innerHTML = '';
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        const books = data.books;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (feedback.length === 0) {
            feedbackList.innerHTML = '<p class="no-books">No feedback found.</p>';
            return;
        }
        feedback.forEach(item => {
            const book = books.find(b => b.id === item.bookId);
            const user = users.find(u => u.id === item.userId);
            const feedbackItem = `
                <div class="col-lg-6 col-md-12 mb-4">
                    <div class="book-card">
                        <div class="book-info">
                            <h3 class="title title-xs">${book ? book.title : 'Unknown Book'}</h3>
                            <p class="desc desc-sm">User: ${user ? user.username : 'Unknown'}</p>
                            <p class="desc desc-sm">${item.text}</p>
                            <p class="desc desc-sm">${new Date(item.date).toLocaleDateString()}</p>
                            <button class="button delete-feedback" data-id="${item.id}">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            feedbackList.innerHTML += feedbackItem;
        });
    } catch (error) {
        console.error('Error rendering feedback:', error);
        feedbackList.innerHTML = '<p class="no-books">Error loading feedback.</p>';
    }
}

// Validate book form
function validateBookForm() {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const price = document.getElementById('book-price').value;
    const category = document.getElementById('book-category').value;
    const description = document.getElementById('book-description').value.trim();
    const image = document.getElementById('book-image').value.trim();
    const rating = document.getElementById('book-rating').value;

    let valid = true;

    if (!title) {
        setError('book-title', 'Title is required');
        valid = false;
    } else {
        clearError('book-title');
    }

    if (!author) {
        setError('book-author', 'Author is required');
        valid = false;
    } else {
        clearError('book-author');
    }

    if (!price || price <= 0) {
        setError('book-price', 'Enter a valid price');
        valid = false;
    } else {
        clearError('book-price');
    }

    if (!category) {
        setError('book-category', 'Category is required');
        valid = false;
    } else {
        clearError('book-category');
    }

    if (!description) {
        setError('book-description', 'Description is required');
        valid = false;
    } else {
        clearError('book-description');
    }

    if (!image) {
        setError('book-image', 'Image filename is required');
        valid = false;
    } else {
        clearError('book-image');
    }

    if (!rating || rating < 0 || rating > 5) {
        setError('book-rating', 'Enter a rating between 0 and 5');
        valid = false;
    } else {
        clearError('book-rating');
    }

    submitBookBtn.disabled = !valid;
    return valid;
}

// Set error message
function setError(id, message) {
    const element = document.getElementById(id);
    const errorSpan = element.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error')) {
        errorSpan.textContent = message;
    }
}

// Clear error message
function clearError(id) {
    const element = document.getElementById(id);
    const errorSpan = element.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error')) {
        errorSpan.textContent = '';
    }
}

// Submit book
async function submitBook(event) {
    event.preventDefault();
    if (!validateBookForm()) return;

    const book = {
        id: editingBookId || Date.now(),
        title: document.getElementById('book-title').value.trim(),
        author: document.getElementById('book-author').value.trim(),
        price: parseFloat(document.getElementById('book-price').value),
        category: document.getElementById('book-category').value,
        description: document.getElementById('book-description').value.trim(),
        image: document.getElementById('book-image').value.trim(),
        rating: parseFloat(document.getElementById('book-rating').value)
    };

    try {
        // Get books from localStorage
        const response = await fetch('./data.json');
        const data = await response.json();
        let books = data.books;
        
        if (editingBookId) {
            // Update existing book
            const index = books.findIndex(b => b.id === editingBookId);
            if (index !== -1) {
                books[index] = book;
            }
        } else {
            // Add new book
            books.push(book);
        }
        
        // Note: In a real app, you'd need to update the data.json file
        // For now, we'll store books in localStorage for the session
        localStorage.setItem('books', JSON.stringify(books));
        
        alert(editingBookId ? 'Book updated!' : 'Book added!');
        bookForm.reset();
        submitBookBtn.disabled = true;
        editingBookId = null;
        submitBookBtn.textContent = 'Add Book';
        cancelEditBtn.style.display = 'none';
        fetchBooks();
    } catch (error) {
        console.error('Error submitting book:', error);
        alert('An error occurred while submitting the book.');
    }
}

// Edit book
function editBook(event) {
    if (event.target.classList.contains('edit-book')) {
        const bookId = event.target.dataset.id;
        fetch(`http://localhost:3000/books/${bookId}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch book');
                return response.json();
            })
            .then(book => {
                document.getElementById('book-id').value = book.id;
                document.getElementById('book-title').value = book.title;
                document.getElementById('book-author').value = book.author;
                document.getElementById('book-price').value = book.price;
                document.getElementById('book-category').value = book.category;
                document.getElementById('book-description').value = book.description;
                document.getElementById('book-image').value = book.image;
                document.getElementById('book-rating').value = book.rating;
                editingBookId = book.id;
                submitBookBtn.textContent = 'Update Book';
                cancelEditBtn.style.display = 'inline-block';
                validateBookForm();
            })
            .catch(error => {
                console.error('Error fetching book:', error);
                alert('An error occurred while loading the book.');
            });
    }
}

// Delete book
function deleteBook(event) {
    if (event.target.classList.contains('delete-book')) {
        const bookId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this book?')) {
            fetch(`http://localhost:3000/books/${bookId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to delete book');
                    alert('Book deleted!');
                    fetchBooks();
                })
                .catch(error => {
                    console.error('Error deleting book:', error);
                    alert('An error occurred while deleting the book.');
                });
        }
    }
}

// Delete feedback
function deleteFeedback(event) {
    if (event.target.classList.contains('delete-feedback')) {
        const feedbackId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this feedback?')) {
            try {
                let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
                feedback = feedback.filter(f => f.id != feedbackId);
                localStorage.setItem('feedback', JSON.stringify(feedback));
                alert('Feedback deleted!');
                fetchFeedback();
            } catch (error) {
                console.error('Error deleting feedback:', error);
                alert('An error occurred while deleting feedback.');
            }
        }
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    if (currentUser && currentUser.role === 'admin') {
        fetchBooks();
        populateUserFilter();
        fetchFeedback();
        bookForm.addEventListener('submit', submitBook);
        bookForm.addEventListener('input', validateBookForm);
        bookList.addEventListener('click', editBook);
        bookList.addEventListener('click', deleteBook);
        feedbackList.addEventListener('click', deleteFeedback);
        bookFilter.addEventListener('change', fetchFeedback);
        userFilter.addEventListener('change', fetchFeedback);
        cancelEditBtn.addEventListener('click', () => {
            bookForm.reset();
            editingBookId = null;
            submitBookBtn.textContent = 'Add Book';
            cancelEditBtn.style.display = 'none';
            submitBookBtn.disabled = true;
        });
    }
});