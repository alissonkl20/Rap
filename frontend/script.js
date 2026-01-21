// API Configuration
const API_BASE_URL = 'http://localhost:8080';

// State Management
const AppState = {
    isLoggedIn: false,
    currentUser: null,
    userPage: null
};

// DOM Elements
const elements = {
    loading: document.getElementById('loading'),
    landingPage: document.getElementById('landing-page'),
    loginModal: document.getElementById('login-modal'),
    registerModal: document.getElementById('register-modal'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    alertContainer: document.getElementById('alert-container')
};

// Utility Functions
class ApiClient {
    static async request(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            console.log(`Making request to: ${url}`, config);
            const response = await fetch(url, config);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async get(endpoint, options = {}) {
        return this.request(endpoint, { method: 'GET', ...options });
    }

    static async post(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : null,
            ...options
        });
    }

    static async put(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : null,
            ...options
        });
    }

    static async delete(endpoint, options = {}) {
        return this.request(endpoint, { method: 'DELETE', ...options });
    }
}

// Alert System
class AlertSystem {
    static show(message, type = 'info', duration = 5000) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        const icon = this.getIcon(type);
        alert.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        elements.alertContainer.appendChild(alert);

        setTimeout(() => {
            if (alert.parentElement) {
                alert.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => alert.remove(), 300);
            }
        }, duration);
    }

    static getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    static success(message, duration) {
        this.show(message, 'success', duration);
    }

    static error(message, duration) {
        this.show(message, 'error', duration);
    }

    static warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    static info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Modal Management
class ModalManager {
    static show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    static hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    static hideAll() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
}

// Authentication Service
class AuthService {
    static async login(credentials) {
        try {
            const response = await ApiClient.post('/auth/login', {
                email: credentials.username,
                senha: credentials.password
            });
            
            AppState.currentUser = response;
            AppState.isLoggedIn = true;
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(response));
            localStorage.setItem('isLoggedIn', 'true');
            
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao fazer login');
        }
    }

    static async register(userData) {
        try {
            const response = await ApiClient.post('/auth/register', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao criar conta');
        }
    }

    static async getCurrentUser() {
        try {
            return await ApiClient.get('/auth/me');
        } catch (error) {
            throw new Error('Erro ao buscar dados do usuário');
        }
    }

    static logout() {
        AppState.currentUser = null;
        AppState.isLoggedIn = false;
        AppState.userPage = null;
        
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to landing page
        location.reload();
    }

    static checkAuthState() {
        const user = localStorage.getItem('user');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (user && isLoggedIn === 'true') {
            try {
                AppState.currentUser = JSON.parse(user);
                AppState.isLoggedIn = true;
                return true;
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                this.logout();
                return false;
            }
        }
        return false;
    }
}

// User Page Service
class UserPageService {
    static async createUserPage(userId, pageData) {
        try {
            const response = await ApiClient.post(`/user-page/create?userId=${userId}`, pageData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao criar página do usuário');
        }
    }

    static async updateUserPage(pageData) {
        try {
            const response = await ApiClient.post('/user-page/update', pageData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar página');
        }
    }

    static async updateUserImage(profileImageUrl = null, backgroundImageUrl = null) {
        try {
            const params = new URLSearchParams();
            if (profileImageUrl) params.append('profileImageUrl', profileImageUrl);
            if (backgroundImageUrl) params.append('backgroundImageUrl', backgroundImageUrl);
            
            const response = await ApiClient.put(`/user-page/update-image?${params}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar imagem');
        }
    }

    static async deleteUserPage(userId) {
        try {
            const response = await ApiClient.delete(`/user-page/delete?userId=${userId}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao excluir página');
        }
    }
}

// Page Navigation
class PageManager {
    static async showDashboard() {
        // Hide landing page
        elements.landingPage.style.display = 'none';
        
        // Load dashboard page
        await this.loadPage('dashboard.html');
    }

    static async showProfile() {
        await this.loadPage('profile.html');
    }

    static async showUserPage() {
        await this.loadPage('user-page.html');
    }

    static async loadPage(filename) {
        try {
            const response = await fetch(filename);
            const html = await response.text();
            
            document.body.innerHTML = html;
            
            // Reload CSS and scripts for the new page
            this.loadPageAssets(filename);
            
        } catch (error) {
            console.error('Error loading page:', error);
            AlertSystem.error('Erro ao carregar página');
        }
    }

    static loadPageAssets(filename) {
        // This would load page-specific CSS and JS
        // For now, we'll handle this in each page's onload
        if (filename === 'dashboard.html') {
            this.initDashboard();
        } else if (filename === 'profile.html') {
            this.initProfile();
        } else if (filename === 'user-page.html') {
            this.initUserPage();
        }
    }

    static initDashboard() {
        console.log('Initializing dashboard...');
        // Dashboard-specific initialization
    }

    static initProfile() {
        console.log('Initializing profile...');
        // Profile-specific initialization
    }

    static initUserPage() {
        console.log('Initializing user page...');
        // User page-specific initialization
    }
}

// Form Handlers
const FormHandlers = {
    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            AlertSystem.warning('Por favor, preencha todos os campos');
            return;
        }

        try {
            await AuthService.login({ username, password });
            AlertSystem.success('Login realizado com sucesso!');
            ModalManager.hideAll();
            
            // Navigate to dashboard
            setTimeout(() => {
                PageManager.showDashboard();
            }, 1000);
            
        } catch (error) {
            AlertSystem.error(error.message);
        }
    },

    async handleRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            AlertSystem.warning('Por favor, preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            AlertSystem.warning('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            AlertSystem.warning('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            AlertSystem.warning('Por favor, insira um email válido');
            return;
        }

        try {
            await AuthService.register({ username, email, password });
            AlertSystem.success('Conta criada com sucesso! Faça login para continuar.');
            ModalManager.hide('register-modal');
            setTimeout(() => {
                ModalManager.show('login-modal');
            }, 500);
            
        } catch (error) {
            AlertSystem.error(error.message);
        }
    }
};

// Event Listeners
function initEventListeners() {
    // Modal triggers
    document.getElementById('login-btn')?.addEventListener('click', () => {
        ModalManager.show('login-modal');
    });

    document.getElementById('register-btn')?.addEventListener('click', () => {
        ModalManager.show('register-modal');
    });

    document.getElementById('hero-register')?.addEventListener('click', () => {
        ModalManager.show('register-modal');
    });

    // Modal navigation
    document.getElementById('show-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        ModalManager.hide('login-modal');
        setTimeout(() => ModalManager.show('register-modal'), 300);
    });

    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        ModalManager.hide('register-modal');
        setTimeout(() => ModalManager.show('login-modal'), 300);
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            ModalManager.hideAll();
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ModalManager.hideAll();
            }
        });
    });

    // Form submissions
    elements.loginForm?.addEventListener('submit', FormHandlers.handleLogin);
    elements.registerForm?.addEventListener('submit', FormHandlers.handleRegister);

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ModalManager.hideAll();
        }
    });
}

// Input Validation
function addInputValidation() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
        });

        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let message = '';

    switch (input.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                message = 'Email inválido';
            }
            break;
        case 'password':
            if (value && value.length < 6) {
                isValid = false;
                message = 'Senha deve ter pelo menos 6 caracteres';
            }
            break;
    }

    if (!isValid) {
        input.classList.add('error');
        showInputError(input, message);
    } else {
        hideInputError(input);
    }
}

function showInputError(input, message) {
    hideInputError(input); // Remove any existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    
    input.parentElement.appendChild(errorDiv);
}

function hideInputError(input) {
    const errorDiv = input.parentElement.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Page Initialization
async function initApp() {
    console.log('Initializing Move Rap App...');
    
    // Check authentication state
    const isAuthenticated = AuthService.checkAuthState();
    
    // Initialize event listeners
    initEventListeners();
    addInputValidation();
    
    // Hide loading screen
    setTimeout(() => {
        elements.loading?.classList.add('hidden');
    }, 1500);
    
    // If user is logged in, redirect to dashboard
    if (isAuthenticated) {
        setTimeout(() => {
            PageManager.showDashboard();
        }, 2000);
    }
    
    console.log('App initialized successfully');
}

// Error Handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    AlertSystem.error('Ops! Algo deu errado. Tente novamente.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    AlertSystem.error('Erro de conexão. Verifique sua internet.');
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Export for use in other pages
window.MoveRap = {
    ApiClient,
    AlertSystem,
    ModalManager,
    AuthService,
    UserPageService,
    PageManager,
    AppState
};