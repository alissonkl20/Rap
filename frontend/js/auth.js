const API_URL = 'http://localhost:8080';

const landingPage = document.getElementById('landing-page');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const btnShowRegister = document.getElementById('btn-show-register');
const btnShowLogin = document.getElementById('btn-show-login');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');
const showRegisterFromLogin = document.getElementById('show-register-from-login');
const showLoginFromRegister = document.getElementById('show-login-from-register');

if (btnShowRegister) {
    btnShowRegister.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });
}
if (btnShowLogin) {
    btnShowLogin.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
}
if (closeLogin) {
    closeLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}
if (closeRegister) {
    closeRegister.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });
}
if (showRegisterFromLogin) {
    showRegisterFromLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
}
if (showLoginFromRegister) {
    showLoginFromRegister.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
}
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});
if (localStorage.getItem('user')) {
    window.location.href = 'dashboard.html';
}

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    // Limpar mensagem de erro anterior
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    
    // Validação no frontend
    if (!email || !password) {
        errorDiv.textContent = 'Email e senha são obrigatórios';
        errorDiv.classList.add('show');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Salva os dados do usuário
            localStorage.setItem('user', JSON.stringify(data));
            // Salva as credenciais para autenticação
            const credentials = btoa(`${email}:${password}`);
            localStorage.setItem('authCredentials', credentials);
            window.location.href = 'dashboard.html';
        } else {
            const data = await response.json().catch(() => ({ message: 'Erro ao fazer login' }));
            
            // Trata diferentes formatos de erro do backend
            let errorMessage = 'Credenciais inválidas';
            if (data.message) {
                errorMessage = data.message;
            } else if (data.errors) {
                // Se houver erros de validação, mostra o primeiro
                const firstError = Object.values(data.errors)[0];
                errorMessage = firstError || errorMessage;
            }
            
            errorDiv.textContent = errorMessage;
            errorDiv.classList.add('show');
        }
    } catch (error) {
        errorDiv.textContent = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
        errorDiv.classList.add('show');
        console.error('Erro:', error);
    }
});

// Registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');
    
    // Limpar mensagens anteriores
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    successDiv.classList.remove('show');
    successDiv.textContent = '';
    
    // Validação no frontend
    if (!username || !email || !password || !confirmPassword) {
        errorDiv.textContent = 'Todos os campos são obrigatórios';
        errorDiv.classList.add('show');
        return;
    }
    
    if (username.length < 3) {
        errorDiv.textContent = 'O nome de usuário deve ter pelo menos 3 caracteres';
        errorDiv.classList.add('show');
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'A senha deve ter pelo menos 6 caracteres';
        errorDiv.classList.add('show');
        return;
    }
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'As senhas não coincidem';
        errorDiv.classList.add('show');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            // Salva os dados do usuário e faz login automático
            localStorage.setItem('user', JSON.stringify(data));
            const credentials = btoa(`${email}:${password}`);
            localStorage.setItem('authCredentials', credentials);
            window.location.href = 'dashboard.html';
        } else {
            const data = await response.json().catch(() => ({ message: 'Erro ao criar conta' }));
            
            // Trata diferentes formatos de erro do backend
            let errorMessage = 'Erro ao criar conta';
            if (data.message) {
                errorMessage = data.message;
            } else if (data.errors) {
                // Se houver erros de validação, mostra o primeiro
                const firstError = Object.values(data.errors)[0];
                errorMessage = firstError || errorMessage;
            } else if (data.error) {
                errorMessage = data.error;
            }
            
            errorDiv.textContent = errorMessage;
            errorDiv.classList.add('show');
        }
    } catch (error) {
        errorDiv.textContent = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
        errorDiv.classList.add('show');
        console.error('Erro:', error);
    }
});
