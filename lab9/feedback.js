const feedbackForm = document.getElementById('feedback-form');
const bookSelect = document.getElementById('book-select');
const feedbackText = document.getElementById('feedback-text');
const submitFeedbackBtn = document.getElementById('submit-feedback');
let currentUser = null;

// Load current user from localStorage
function loadUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        document.querySelector('.admin-link').style.display = currentUser.role === 'admin' ? 'inline-block' : 'none';
        if (currentUser.role === 'admin') {
            alert('Admins cannot leave feedback.');
            submitFeedbackBtn.disabled = true;
            feedbackForm.style.display = 'none';
        }
    } else {
        alert('Please log in to leave feedback.');
        submitFeedbackBtn.disabled = true;
        feedbackForm.style.display = 'none';
        window.location.href = 'register.html';
    }
}

// Fetch purchased books for the current user from localStorage
async function fetchPurchasedBooks() {
    if (!currentUser) return;
    try {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const userOrders = orders.filter(order => order.userId === currentUser.id);
        const bookIds = [...new Set(userOrders.map(order => order.bookId))];
        
        const response = await fetch('./data.json');
        const data = await response.json();
        const books = data.books;
        const purchasedBooks = books.filter(book => bookIds.includes(book.id));
        
        bookSelect.innerHTML = '<option value="">Select a book</option>';
        if (purchasedBooks.length === 0) {
            bookSelect.innerHTML = '<option value="">No purchased books available</option>';
            submitFeedbackBtn.disabled = true;
        } else {
            purchasedBooks.forEach(book => {
                const option = document.createElement('option');
                option.value = book.id;
                option.textContent = book.title;
                bookSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching purchased books:', error);
        bookSelect.innerHTML = '<option value="">Error loading books</option>';
        submitFeedbackBtn.disabled = true;
    }
}

// Validate feedback form
function validateFeedback() {
    const bookId = bookSelect.value;
    const text = feedbackText.value.trim();
    let valid = true;

    if (!bookId) {
        setError('book-select', 'Please select a book');
        valid = false;
    } else {
        clearError('book-select');
    }

    if (text.length < 6) {
        setError('feedback-text', 'Feedback must be at least 6 characters');
        valid = false;
    } else {
        clearError('feedback-text');
    }

    submitFeedbackBtn.disabled = !valid || !currentUser || currentUser.role === 'admin';
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

// Submit feedback
async function submitFeedback(event) {
    event.preventDefault();
    if (!validateFeedback()) return;

    const feedback = {
        id: Date.now(),
        userId: currentUser.id,
        bookId: parseInt(bookSelect.value),
        text: feedbackText.value.trim(),
        date: new Date().toISOString()
    };

    try {
        // Get existing feedback from localStorage
        let feedbackList = JSON.parse(localStorage.getItem('feedback')) || [];
        feedbackList.push(feedback);
        localStorage.setItem('feedback', JSON.stringify(feedbackList));
        
        alert('Feedback submitted successfully!');
        feedbackForm.reset();
        submitFeedbackBtn.disabled = true;
        fetchPurchasedBooks();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('An error occurred while submitting feedback.');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    if (currentUser && currentUser.role !== 'admin') {
        fetchPurchasedBooks();
        feedbackForm.addEventListener('input', validateFeedback);
        feedbackForm.addEventListener('submit', submitFeedback);
    }
});