const books = [/* Array from 1.1 */];

document.addEventListener('DOMContentLoaded', () => {
    const catalogContainer = document.getElementById('catalog');
    
    function displayBooks(bookArray) {
        catalogContainer.innerHTML = '';
        bookArray.forEach(book => {
            const card = `
                <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                    <div class="book-card">
                        <img src="${book.photo}" alt="${book.title}">
                        <div class="book-info">
                            <h3 class="title title-sm">${book.title}</h3>
                            <p class="desc desc-blue">Author: ${book.author}</p>
                            <p class="desc desc-blue">Price: $${book.price.toFixed(2)}</p>
                            <p class="desc">${book.description}</p>
                            <p class="desc desc-blue">Category: ${book.category}</p>
                            <p class="desc desc-blue">Rating: ${book.rating}/5</p>
                        </div>
                    </div>
                </div>
            `;
            catalogContainer.innerHTML += card;
        });
    }
document.addEventListener('DOMContentLoaded', () => {
    const catalogContainer = document.getElementById('catalog');

    displayBooks(books); // Initial display of all books
});
});document.addEventListener('DOMContentLoaded', () => {
    const catalogContainer = document.getElementById('catalog');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

    let currentSearch = '';
    let currentCategories = [];
    let currentSort = 'default';

    function displayBooks(bookArray) {
        catalogContainer.innerHTML = '';
        if (!Array.isArray(bookArray) || bookArray.length === 0) {
            catalogContainer.innerHTML = `<p class="desc text-center">${bookArray || 'No books found.'}</p>`;
            return;
        }
        bookArray.forEach(book => {
            const card = `
                <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
                    <div class="book-card">
                        <img src="${book.photo}" alt="${book.title}">
                        <div class="book-info">
                            <h3 class="title title-sm">${book.title}</h3>
                            <p class="desc desc-blue">Author: ${book.author}</p>
                            <p class="desc desc-blue">Price: $${book.price.toFixed(2)}${book.discountedPrice ? ` (Discounted: $${book.discountedPrice.toFixed(2)})` : ''}</p>
                            <p class="desc">${book.description}</p>
                            <p class="desc desc-blue">Category: ${book.category}</p>
                            <p class="desc desc-blue">Rating: ${book.rating}/5</p>
                        </div>
                    </div>
                </div>
            `;
            catalogContainer.innerHTML += card;
        });
    }
    const books = [
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 10.99,
            description: "A novel about the American dream.",
            category: "Fiction",
            photo: "https://via.placeholder.com/150",
            rating: 4.5
        },
        {
            title: "Sapiens",
            author: "Yuval Noah Harari",
            price: 15.99,
            description: "A brief history of humankind.",
            category: "Non-Fiction",
            photo: "https://via.placeholder.com/150",
            rating: 4.7
        },
        {
            title: "1984",
            author: "George Orwell",
            price: 12.49,
            description: "A dystopian novel about totalitarianism.",
            category: "Fiction",
            photo: "https://via.placeholder.com/150",
            rating: 4.8
        },
        {
            title: "A Brief History of Time",
            author: "Stephen Hawking",
            price: 18.99,
            description: "Exploring the universe's mysteries.",
            category: "Science",
            photo: "https://via.placeholder.com/150",
            rating: 4.6
        },
        {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            price: 14.99,
            description: "An adventure in Middle-earth.",
            category: "Fantasy",
            photo: "https://via.placeholder.com/150",
            rating: 4.9
        },
        {
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            price: 11.99,
            description: "A story of justice and morality.",
            category: "Fiction",
            photo: "https://via.placeholder.com/150",
            rating: 4.7
        },
        {
            title: "The Da Vinci Code",
            author: "Dan Brown",
            price: 13.99,
            description: "A thrilling mystery novel.",
            category: "Mystery",
            photo: "https://via.placeholder.com/150",
            rating: 4.4
        },
        {
            title: "Guns, Germs, and Steel",
            author: "Jared Diamond",
            price: 16.99,
            description: "The fates of human societies.",
            category: "History",
            photo: "https://via.placeholder.com/150",
            rating: 4.5
        },
        {
            title: "Dune",
            author: "Frank Herbert",
            price: 17.99,
            description: "A science fiction epic.",
            category: "Science",
            photo: "https://via.placeholder.com/150",
            rating: 4.8
        },
        {
            title: "Pride and Prejudice",
            author: "Jane Austen",
            price: 9.99,
            description: "A classic romance novel.",
            category: "Fiction",
            photo: "https://via.placeholder.com/150",
            rating: 4.6
        },
        {
            title: "The Alchemist",
            author: "Paulo Coelho",
            price: 13.49,
            description: "A journey of self-discovery.",
            category: "Fantasy",
            photo: "https://via.placeholder.com/150",
            rating: 4.5
        },
        {
            title: "Educated",
            author: "Tara Westover",
            price: 14.99,
            description: "A memoir of education and identity.",
            category: "Non-Fiction",
            photo: "https://via.placeholder.com/150",
            rating: 4.7
        },
        {
            title: "The Catcher in the Rye",
            author: "J.D. Salinger",
            price: 10.49,
            description: "A tale of teenage rebellion.",
            category: "Fiction",
            photo: "https://via.placeholder.com/150",
            rating: 4.3
        },
        {
            title: "The Name of the Wind",
            author: "Patrick Rothfuss",
            price: 19.99,
            description: "A fantasy epic of a young hero.",
            category: "Fantasy",
            photo: "https://via.placeholder.com/150",
            rating: 4.9
        },
        {
            title: "The Gunslinger",
            author: "Stephen King",
            price: 15.49,
            description: "A dark fantasy western.",
            category: "Mystery",
            photo: "https://via.placeholder.com/150",
            rating: 4.6
        }
    ];
    displayBooks(books);

    function updateCatalog() {
        let filteredBooks = books;

        // Search filter
        if (currentSearch) {
            const query = currentSearch.toLowerCase();
            filteredBooks = filteredBooks.filter(book =>
                book.title.toLowerCase().includes(query) ||
                book.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (currentCategories.length > 0) {
            filteredBooks = filteredBooks.filter(book => currentCategories.includes(book.category));
        }

        // Sorting
        if (currentSort === 'price-asc') {
            filteredBooks = [...filteredBooks].sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-desc') {
            filteredBooks = [...filteredBooks].sort((a, b) => b.price - a.price);
        } else if (currentSort === 'title-asc') {
            filteredBooks = [...filteredBooks].sort((a, b) => a.title.localeCompare(b.title));
        } else if (currentSort === 'rating-desc') {
            filteredBooks = [...filteredBooks].sort((a, b) => b.rating - a.rating);
        }

        displayBooks(filteredBooks);
    }
   

    // Search event
    searchInput.addEventListener('input', () => {
        currentSearch = searchInput.value;
        updateCatalog();
    });

    // Sort event
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        updateCatalog();
    });

    // Category filter event
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            currentCategories = Array.from(categoryCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            updateCatalog();
        });
    });

    // Button event listeners (from Stage 2, unchanged)
    /* ... */
});