// Dashboard specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    console.log('Initializing dashboard...');
    
    // Check if user is authenticated
    if (!window.MoveRap || !window.MoveRap.AppState.isLoggedIn) {
        // Redirect to login page
        window.location.href = 'index.html';
        return;
    }

    // Update user info in sidebar and welcome message
    updateUserInfo();
    
    // Initialize event listeners
    initDashboardEventListeners();
    
    // Initialize sidebar toggle
    initSidebarToggle();
    
    // Initialize user menu
    initUserMenu();
    
    // Load user page if exists
    loadUserPageData();
}

function updateUserInfo() {
    const user = window.MoveRap.AppState.currentUser;
    if (user) {
        // Update sidebar username
        const sidebarUsername = document.getElementById('sidebar-username');
        if (sidebarUsername) {
            sidebarUsername.textContent = user.username;
        }
        
        // Update welcome message
        const welcomeUsername = document.getElementById('welcome-username');
        if (welcomeUsername) {
            welcomeUsername.textContent = user.username;
        }
    }
}

function initDashboardEventListeners() {
    // Logout buttons
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('header-logout')?.addEventListener('click', handleLogout);
    
    // Navigation items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Quick action buttons
    document.getElementById('create-page-btn')?.addEventListener('click', showCreatePageModal);
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
        window.MoveRap.PageManager.showProfile();
    });
    document.getElementById('manage-page-btn')?.addEventListener('click', () => {
        window.MoveRap.PageManager.showUserPage();
    });
    document.getElementById('add-music-btn')?.addEventListener('click', () => {
        window.MoveRap.AlertSystem.info('Funcionalidade de adicionar música em breve!');
    });
    document.getElementById('view-analytics-btn')?.addEventListener('click', () => {
        window.MoveRap.AlertSystem.info('Funcionalidade de analytics em breve!');
    });
    
    // Create page form
    document.getElementById('create-page-form')?.addEventListener('submit', handleCreatePage);
    
    // Modal close functionality
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            window.MoveRap.ModalManager.hideAll();
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }
    
    // Handle responsive behavior
    window.addEventListener('resize', () => {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('active');
        }
    });
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

function initUserMenu() {
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    
    if (userMenuToggle && userMenuDropdown) {
        userMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', () => {
            userMenuDropdown.classList.remove('active');
        });
    }
}

function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        window.MoveRap.AuthService.logout();
    }
}

function handleNavigation(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const currentActive = document.querySelector('.nav-item.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }
    event.currentTarget.parentElement.classList.add('active');

    // Navegação real usando PageManager
    switch (href) {
        case '#dashboard':
            window.MoveRap.PageManager.showDashboard();
            break;
        case '#profile':
            window.MoveRap.PageManager.showProfile();
            break;
        case '#my-page':
            window.MoveRap.PageManager.showUserPage();
            break;
        case '#music':
            window.MoveRap.AlertSystem.info('Funcionalidade de músicas em breve!');
            break;
        case '#community':
            window.MoveRap.AlertSystem.info('Funcionalidade de comunidade em breve!');
            break;
        case '#settings':
            window.MoveRap.AlertSystem.info('Funcionalidade de configurações em breve!');
            break;
        default:
            console.log('Unknown navigation:', href);
    }
}

function showCreatePageModal() {
    window.MoveRap.ModalManager.show('create-page-modal');
}

async function handleCreatePage(event) {
    event.preventDefault();
    
    const biography = document.getElementById('biography').value.trim();
    const profileImageUrl = document.getElementById('profile-image-url').value.trim();
    const backgroundImageUrl = document.getElementById('background-image-url').value.trim();
    const musicUrls = document.getElementById('music-urls').value.trim();
    
    if (!biography) {
        window.MoveRap.AlertSystem.warning('Por favor, preencha pelo menos a biografia');
        return;
    }
    
    try {
        const currentUser = window.MoveRap.AppState.currentUser;
        if (!currentUser) {
            throw new Error('Usuário não encontrado');
        }
        
        const pageData = {
            biography,
            profileImageUrl: profileImageUrl || null,
            backgroundImageUrl: backgroundImageUrl || null,
            musicUrls: musicUrls || null
        };
        
        console.log('Creating user page with data:', pageData);
        
        const response = await window.MoveRap.UserPageService.createUserPage(
            currentUser.id,
            pageData
        );
        
        console.log('User page created:', response);
        
        window.MoveRap.AlertSystem.success('Página criada com sucesso!');
        window.MoveRap.ModalManager.hideAll();
        
        // Clear form
        document.getElementById('create-page-form').reset();
        
        // Update app state
        window.MoveRap.AppState.userPage = response;
        
        // Update UI to reflect that user now has a page
        updateQuickActions();
        
    } catch (error) {
        console.error('Error creating user page:', error);
        window.MoveRap.AlertSystem.error(error.message);
    }
}

function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    if (searchTerm.length > 2) {
        console.log('Searching for:', searchTerm);
        window.MoveRap.AlertSystem.info('Funcionalidade de busca em desenvolvimento');
    }
}

async function loadUserPageData() {
    // This would typically load the user's existing page data
    // For now, we'll just simulate some data
    try {
        // Simulate loading user page data
        console.log('Loading user page data...');
        
        // Update stats with simulated data
        updateStats({
            views: Math.floor(Math.random() * 5000),
            likes: Math.floor(Math.random() * 500),
            followers: Math.floor(Math.random() * 1000),
            tracks: Math.floor(Math.random() * 50)
        });
        
    } catch (error) {
        console.error('Error loading user page data:', error);
    }
}

function updateStats(stats) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers[0]) statNumbers[0].textContent = stats.views.toLocaleString();
    if (statNumbers[1]) statNumbers[1].textContent = stats.likes.toLocaleString();
    if (statNumbers[2]) statNumbers[2].textContent = stats.followers.toLocaleString();
    if (statNumbers[3]) statNumbers[3].textContent = stats.tracks.toLocaleString();
}

function updateQuickActions() {
    // Update quick actions based on whether user has a page
    const hasPage = window.MoveRap.AppState.userPage !== null;
    const createPageBtn = document.getElementById('create-page-btn');
    const managePageBtn = document.getElementById('manage-page-btn');
    
    if (hasPage) {
        if (createPageBtn) {
            createPageBtn.style.display = 'none';
        }
        if (managePageBtn) {
            managePageBtn.style.display = 'block';
        }
    }
}

// Utility function for debouncing
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Animation utilities
function animateNumber(element, finalNumber, duration = 1000) {
    const startNumber = 0;
    const increment = finalNumber / (duration / 16);
    let currentNumber = startNumber;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            element.textContent = finalNumber.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentNumber).toLocaleString();
        }
    }, 16);
}

// Initialize number animations on page load
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((element, index) => {
        const finalNumber = parseInt(element.textContent.replace(/,/g, ''));
        element.textContent = '0';
        setTimeout(() => {
            animateNumber(element, finalNumber, 1500);
        }, index * 200);
    });
}

// Run animations after a short delay
setTimeout(animateStats, 500);