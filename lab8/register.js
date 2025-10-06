const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerUsername = document.getElementById('register-username');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const submitRegisterBtn = document.getElementById('submit-register');
const submitLoginBtn = document.getElementById('submit-login');

// Validate register form
function validateRegisterForm() {
    const username = registerUsername.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();
    let valid = true;

    if (!username || username.length < 3) {
        setError('register-username', 'Username must be at least 3 characters');
        valid = false;
    } else {
        clearError('register-username');
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError('register-email', 'Valid email is required');
        valid = false;
    } else {
        clearError('register-email');
    }

    if (!password || password.length < 6) {
        setError('register-password', 'Password must be at least 6 characters');
        valid = false;
    } else {
        clearError('register-password');
    }

    submitRegisterBtn.disabled = !valid;
    return valid;
}

// Validate login form
function validateLoginForm() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setError('login-email', 'Valid email is required');
        valid = false;
    } else {
        clearError('login-email');
    }

    if (!password) {
        setError('login-password', 'Password is required');
        valid = false;
    } else {
        clearError('login-password');
    }

    submitLoginBtn.disabled = !valid;
    return valid;
}

// Set error message
function setError(id, message) {
    const element = document.getElementById(id);
    const errorSpan = element.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error')) {
        errorSpan.textContent = message;
    } else {
        const newError = document.createElement('span');
        newError.className = 'error';
        newError.textContent = message;
        element.parentNode.appendChild(newError);
    }
}

// Clear error message
function clearError(id) {
    const element = document.getElementById(id);
    const errorSpan = element.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error')) {
        errorSpan.remove();
    }
}

// Register user
async function registerUser(event) {
    event.preventDefault();
    if (!validateRegisterForm()) return;

    const user = {
        id: Date.now(), // Simple way to generate unique ID
        username: registerUsername.value.trim(),
        email: registerEmail.value.trim(),
        password: registerPassword.value.trim(), // In a real app, hash the password
        role: 'user'
    };

    try {
        // Get existing users from localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        const existingUser = users.find(u => u.email === user.email);
        if (existingUser) {
            alert('Email already registered.');
            return;
        }

        // Add new user
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Registration successful! Please login.');
        registerForm.reset();
        submitRegisterBtn.disabled = true;
    } catch (error) {
        console.error('Error registering user:', error);
        alert('An error occurred while registering.');
    }
}

// Login user
async function loginUser(event) {
    event.preventDefault();
    if (!validateLoginForm()) return;

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            alert('Invalid email or password.');
            return;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize localStorage with admin user from data.json if not already present
    if (!localStorage.getItem('users')) {
        fetch('./data.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('users', JSON.stringify(data.users));
            })
            .catch(error => {
                console.error('Error loading initial data:', error);
            });
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.querySelector('.admin-link').style.display = currentUser.role === 'admin' ? 'inline-block' : 'none';
    }
    registerForm.addEventListener('submit', registerUser);
    loginForm.addEventListener('submit', loginUser);
    registerForm.addEventListener('input', validateRegisterForm);
    loginForm.addEventListener('input', validateLoginForm);
});