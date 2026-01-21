const API_URL = 'http://localhost:8080';
let currentUser = null;
let userPage = null;
let authCredentials = null;

// Verifica se está autenticado
if (!localStorage.getItem('user') || !localStorage.getItem('authCredentials')) {
    window.location.href = 'index.html';
}

currentUser = JSON.parse(localStorage.getItem('user'));
authCredentials = localStorage.getItem('authCredentials');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadUserPage();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Menu lateral
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            switchTab(tabId);
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Criar página
    document.getElementById('create-page-btn')?.addEventListener('click', () => {
        switchTab('edit-page');
    });

    // Form da página
    document.getElementById('page-form').addEventListener('submit', savePage);

    // Deletar página
    document.getElementById('delete-page-btn').addEventListener('click', deletePage);

    // Adicionar música
    document.getElementById('add-music-url').addEventListener('click', addMusicUrlInput);

    // Contador de caracteres da biografia
    document.getElementById('biography').addEventListener('input', (e) => {
        const count = e.target.value.length;
        document.querySelector('.char-count').textContent = `${count}/1000`;
    });
}

// Alternar entre abas
function switchTab(tabId) {
    // Remover active de todos
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Adicionar active nos selecionados
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}-tab`).classList.add('active');
}

// Carregar informações do usuário
function loadUserInfo() {
    document.getElementById('user-name').textContent = currentUser.username;
    document.getElementById('profile-username').textContent = currentUser.username;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-id').textContent = currentUser.id;
}

// Carregar página do usuário
async function loadUserPage() {
    try {
        const response = await fetch(`${API_URL}/user-page/me`, {
            headers: {
                'Authorization': `Basic ${authCredentials}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            userPage = await response.json();
            // Verifica se a página tem conteúdo
            if (userPage && (userPage.biography || userPage.profileImageUrl || userPage.backgroundImageUrl || userPage.musicUrls)) {
                displayUserPage();
                populateEditForm();
            } else {
                displayNoPage();
            }
        } else {
            // Usuário não tem página ainda
            displayNoPage();
        }
    } catch (error) {
        console.error('Erro ao carregar página:', error);
        displayNoPage();
    }
}

// Exibir mensagem de página não criada
function displayNoPage() {
    document.getElementById('user-page-preview').innerHTML = `
        <div class="preview-message">
            <p>Você ainda não criou sua página.</p>
            <button id="create-page-btn" class="btn btn-primary">Criar Página</button>
        </div>
    `;
    
    document.getElementById('create-page-btn').addEventListener('click', () => {
        switchTab('edit-page');
    });
}

// Exibir página do usuário
function displayUserPage() {
    const musicUrls = userPage.musicUrls ? userPage.musicUrls.split(',') : [];
    
    let musicHtml = '';
    if (musicUrls.length > 0) {
        musicHtml = `
            <div class="music-list">
                <h3>🎵 Minhas Músicas</h3>
                ${musicUrls.map((url, index) => `
                    <div class="music-item">
                        <span>Música ${index + 1}</span>
                        <a href="${url}" target="_blank">Ouvir</a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('user-page-preview').innerHTML = `
        <div class="user-page-display">
            <img src="${userPage.backgroundImageUrl || ''}" 
                 class="page-background" 
                 onerror="this.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)'"
                 style="${!userPage.backgroundImageUrl ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : ''}">
            <div class="page-header">
                <img src="${userPage.profileImageUrl || 'https://via.placeholder.com/120'}" 
                     class="profile-image"
                     onerror="this.src='https://via.placeholder.com/120'">
                <h2>${currentUser.username}</h2>
                ${userPage.biography ? `<div class="page-biography">${userPage.biography}</div>` : ''}
            </div>
            ${musicHtml}
        </div>
    `;
}

// Preencher formulário de edição
function populateEditForm() {
    if (!userPage) return;

    document.getElementById('biography').value = userPage.biography || '';
    document.getElementById('profileImageUrl').value = userPage.profileImageUrl || '';
    document.getElementById('backgroundImageUrl').value = userPage.backgroundImageUrl || '';

    // Atualizar contador de caracteres
    const count = (userPage.biography || '').length;
    document.querySelector('.char-count').textContent = `${count}/1000`;

    // Preencher URLs de música
    const container = document.getElementById('music-urls-container');
    container.innerHTML = '';

    const musicUrls = userPage.musicUrls ? userPage.musicUrls.split(',') : [''];
    
    musicUrls.forEach(url => {
        addMusicUrlInput(url);
    });
}

// Adicionar campo de URL de música
function addMusicUrlInput(value = '') {
    const container = document.getElementById('music-urls-container');
    const div = document.createElement('div');
    div.className = 'music-url-input';
    div.innerHTML = `
        <input type="url" class="music-url" placeholder="https://youtube.com/..." value="${value}">
        <button type="button" class="btn-remove" onclick="removeMusicUrl(this)">❌</button>
    `;
    container.appendChild(div);
}

// Remover campo de URL de música
function removeMusicUrl(button) {
    button.parentElement.remove();
}

// Salvar página
async function savePage(e) {
    e.preventDefault();

    const biography = document.getElementById('biography').value;
    const profileImageUrl = document.getElementById('profileImageUrl').value;
    const backgroundImageUrl = document.getElementById('backgroundImageUrl').value;
    
    const musicUrlInputs = document.querySelectorAll('.music-url');
    const musicUrlsList = Array.from(musicUrlInputs)
        .map(input => input.value)
        .filter(url => url.trim() !== '');

    const pageData = {
        biography,
        profileImageUrl,
        backgroundImageUrl,
        musicUrlsList
    };

    const messageDiv = document.getElementById('page-form-message');

    try {
        const endpoint = userPage && (userPage.biography || userPage.profileImageUrl || userPage.backgroundImageUrl || userPage.musicUrls) 
            ? '/user-page/update' 
            : '/user-page/create';
        const method = endpoint.includes('update') ? 'PUT' : 'POST';
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authCredentials}`
            },
            credentials: 'include',
            body: JSON.stringify(pageData)
        });

        if (response.ok) {
            const data = await response.json();
            messageDiv.textContent = endpoint.includes('update') ? 'Página atualizada com sucesso!' : 'Página criada com sucesso!';
            messageDiv.className = 'form-message success';
            
            // Recarregar página
            await loadUserPage();
            
            // Voltar para "Minha Página" após 2 segundos
            setTimeout(() => {
                switchTab('my-page');
                messageDiv.className = 'form-message';
            }, 2000);
        } else {
            const data = await response.json().catch(() => ({ message: 'Erro ao salvar página' }));
            messageDiv.textContent = data.message || 'Erro ao salvar página';
            messageDiv.className = 'form-message error';
        }
    } catch (error) {
        messageDiv.textContent = 'Erro ao conectar com o servidor';
        messageDiv.className = 'form-message error';
        console.error('Erro:', error);
    }
}

// Deletar página
async function deletePage() {
    if (!confirm('Tem certeza que deseja excluir sua página?')) {
        return;
    }

    const messageDiv = document.getElementById('page-form-message');

    try {
        const response = await fetch(`${API_URL}/user-page/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Basic ${authCredentials}`
            },
            credentials: 'include'
        });

        if (response.ok) {
            messageDiv.textContent = 'Página excluída com sucesso!';
            messageDiv.className = 'form-message success';

            userPage = null;

            // Limpar formulário
            document.getElementById('page-form').reset();
            document.getElementById('music-urls-container').innerHTML = '';
            addMusicUrlInput();

            // Voltar para "Minha Página"
            setTimeout(() => {
                switchTab('my-page');
                displayNoPage();
                messageDiv.className = 'form-message';
            }, 2000);
        } else {
            const data = await response.json().catch(() => ({ message: 'Erro ao excluir página' }));
            messageDiv.textContent = data.message || 'Erro ao excluir página';
            messageDiv.className = 'form-message error';
        }
    } catch (error) {
        messageDiv.textContent = 'Erro ao conectar com o servidor';
        messageDiv.className = 'form-message error';
        console.error('Erro:', error);
    }
}

// Logout
function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('authCredentials');
        window.location.href = 'index.html';
    }
}
