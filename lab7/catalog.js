let currentPage = 1;
const booksPerPage = 8;
let books = [];
let allBooks = [];
let currentCategory = 'all';
let currentSort = 'title-asc';

// Debounce function for search
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Fetch all books from server
async function fetchAllBooks() {
  try {
    const response = await fetch('http://localhost:3000/books');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    allBooks = await response.json();
    console.log('Books fetched successfully:', allBooks.length);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    allBooks = [];
    const bookList = document.getElementById('book-list');
    if (bookList) {
      bookList.innerHTML = '<p class="no-books">Error loading books. Check if JSON Server is running at http://localhost:3000.</p>';
    }
  }
}

// Sorting functions map
const sortFunctions = {
  'title-asc': (a, b) => a.title.localeCompare(b.title),
  'title-desc': (a, b) => b.title.localeCompare(a.title),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price
};

// Fetch books for current page with filters and sorting
async function fetchBooks(searchQuery = '') {
  try {
    const loader = document.getElementById('loader');
    const bookList = document.getElementById('book-list');
    if (loader) loader.style.display = 'block';
    if (bookList) bookList.innerHTML = '';

    if (!allBooks.length) {
      console.log('allBooks is empty, attempting to fetch again');
      await fetchAllBooks();
      if (!allBooks.length) {
        throw new Error('No books available after retry');
      }
    }

    let filteredBooks = allBooks.filter(book => 
      (currentCategory === 'all' || book.category === currentCategory) &&
      (searchQuery === '' || book.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const sortFunc = sortFunctions[currentSort] || sortFunctions['title-asc'];
    filteredBooks.sort(sortFunc);

    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    books = filteredBooks.slice(start, end);
    console.log('Rendering books for page', currentPage, ':', books.length);

    renderBooks();
    updatePagination(filteredBooks.length);
  } catch (error) {
    console.error('Error in fetchBooks:', error.message);
    const bookList = document.getElementById('book-list');
    if (bookList) {
      bookList.innerHTML = '<p class="no-books">Error loading books. Please try again.</p>';
    }
  } finally {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }
}

// Render books to DOM
function renderBooks() {
  const bookList = document.getElementById('book-list');
  if (!bookList) return;
  bookList.innerHTML = '';
  if (books.length === 0) {
    bookList.innerHTML = '<p class="no-books">No books found.</p>';
    return;
  }
  books.forEach(book => {
    const bookCard = `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="book-card">
          <img src="http://localhost:3000/images/${book.image || 'placeholder.jpg'}" alt="${book.title}" class="book-img">
          <div class="book-info">
            <h3 class="title title-xs">${book.title}</h3>
            <p class="desc desc-sm">${book.author}</p>
            <p class="desc desc-sm desc-yellow">$${book.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    `;
    bookList.innerHTML += bookCard;
  });
}

// Update pagination controls
function updatePagination(totalItems) {
  const currentPageSpan = document.getElementById('currentPage');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  if (currentPageSpan) currentPageSpan.textContent = currentPage;
  if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
  const maxPage = Math.ceil(totalItems / booksPerPage);
  if (nextPageBtn) nextPageBtn.disabled = currentPage >= maxPage;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  fetchAllBooks();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const debouncedFetchBooks = debounce((value) => {
      currentPage = 1;
      fetchBooks(value);
    }, 300);
    searchInput.addEventListener('input', (e) => {
      debouncedFetchBooks(e.target.value);
    });
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value || 'title-asc';
      currentPage = 1;
      console.log('Sort changed to:', currentSort);
      fetchBooks(searchInput ? searchInput.value : '');
    });
  }

  document.querySelectorAll('.category-filter input[name="category"]').forEach(filter => {
    filter.addEventListener('change', (e) => {
      currentCategory = e.target.dataset.category;
      currentPage = 1;
      console.log('Category changed to:', currentCategory);
      fetchBooks(searchInput ? searchInput.value : '');
    });
  });

  const prevPageBtn = document.getElementById('prevPage');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchBooks(searchInput ? searchInput.value : '');
      }
    });
  }

  const nextPageBtn = document.getElementById('nextPage');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const maxPage = Math.ceil(allBooks.length / booksPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        fetchBooks(searchInput ? searchInput.value : '');
      }
    });
  }
});