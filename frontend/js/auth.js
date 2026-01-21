const API_URL = 'http://localhost:8080';

// Toggle entre login e registro
document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

// Verifica se já está logado
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
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Salva os dados do usuário
            localStorage.setItem('user', JSON.stringify(data));
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
    const errorDiv = document.getElementById('register-error');
    
    // Limpar mensagem de erro anterior
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
    
    // Validação no frontend
    if (!username || !email || !password) {
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
