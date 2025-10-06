const cartList = document.getElementById('cart-list');
const checkoutBtn = document.getElementById('checkout-btn');
let cart = [];
let currentUser = null;

// Load current user from localStorage
function loadUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        document.querySelector('.admin-link').style.display = currentUser.role === 'admin' ? 'inline-block' : 'none';
    }
}

// Fetch cart from localStorage and render
async function fetchCart() {
  try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
      renderCart();
  } catch (error) {
      console.error('Error fetching cart:', error);
      cartList.innerHTML = '<p class="no-books">Error loading cart.</p>';
  }
}

// Render cart items
function renderCart() {
    cartList.innerHTML = '';
    if (cart.length === 0) {
        cartList.innerHTML = '<p class="no-books">Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        return;
    }
    cart.forEach(item => {
        const cartItem = `
            <div class="col-lg-6 col-md-12 mb-4">
                <div class="book-card">
                    <img src="public/images/${item.image || 'placeholder.jpg'}" alt="${item.title}" class="book-img">
                    <div class="book-info">
                        <h3 class="title title-xs">${item.title}</h3>
                        <p class="desc desc-sm">${item.author}</p>
                        <p class="desc desc-sm desc-yellow">$${item.price.toFixed(2)}</p>
                        <p class="desc desc-sm">Quantity: ${item.quantity}</p>
                        <button class="button remove-from-cart" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
        cartList.innerHTML += cartItem;
    });
    checkoutBtn.disabled = !currentUser || cart.length === 0;
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Remove from cart
async function removeFromCart(event) {
    if (event.target.classList.contains('remove-from-cart')) {
        const itemId = parseInt(event.target.dataset.id);
        try {
            // Remove item from localStorage cart
            cart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Item removed from cart!');
            fetchCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
            alert('Failed to remove item.');
        }
    }
}

// Place order
async function placeOrder() {
    if (!currentUser) {
        alert('Please log in to place an order.');
        window.location.href = 'register.html';
        return;
    }
    try {
        // Get existing orders from localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Create new orders
        const newOrders = cart.map(item => ({
            id: Date.now() + Math.random(), // Simple ID generation
            userId: currentUser.id,
            bookId: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            quantity: item.quantity,
            date: new Date().toISOString()
        }));
        
        // Add new orders to existing ones
        orders = orders.concat(newOrders);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        alert('Order placed successfully!');
        renderCart();
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    fetchCart();
    checkoutBtn.addEventListener('click', placeOrder);
    // Добавляем обработчик событий для динамически созданных кнопок
    cartList.addEventListener('click', removeFromCart);
});