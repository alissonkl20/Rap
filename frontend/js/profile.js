// Profile Page Script
const API_URL = 'http://localhost:8080';

// Get username from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

// Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error-message');
const profileContentEl = document.getElementById('profile-content');
const notFoundEl = document.getElementById('not-found');

// Profile elements
const backgroundImageEl = document.getElementById('background-image');
const profileAvatarEl = document.getElementById('profile-avatar');
const biographyContentEl = document.getElementById('biography-content');
const musicListEl = document.getElementById('music-list');

// Default images
const DEFAULT_AVATAR = 'https://via.placeholder.com/180/667eea/ffffff?text=🎤';
const DEFAULT_BACKGROUND = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

// Load profile data
async function loadProfile() {
    if (!username) {
        showNotFound();
        return;
    }

    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        profileContentEl.style.display = 'none';
        notFoundEl.style.display = 'none';

        const response = await fetch(`${API_URL}/user-page/public/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 404) {
            showNotFound();
            return;
        }

        if (!response.ok) {
            throw new Error('Erro ao carregar perfil');
        }

        const data = await response.json();
        displayProfile(data);

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        showError();
    } finally {
        loadingEl.style.display = 'none';
    }
}

// Display profile data
function displayProfile(data) {
    // Set background image
    if (data.backgroundImageUrl) {
        const backgroundUrl = data.backgroundImageUrl.startsWith('http') 
            ? data.backgroundImageUrl 
            : `${API_URL}${data.backgroundImageUrl}`;
        backgroundImageEl.style.backgroundImage = `url('${backgroundUrl}')`;
    } else {
        backgroundImageEl.style.background = DEFAULT_BACKGROUND;
    }

    // Set profile avatar
    if (data.profileImageUrl) {
        const avatarUrl = data.profileImageUrl.startsWith('http') 
            ? data.profileImageUrl 
            : `${API_URL}${data.profileImageUrl}`;
        profileAvatarEl.src = avatarUrl;
    } else {
        profileAvatarEl.src = DEFAULT_AVATAR;
    }
    profileAvatarEl.alt = 'Avatar do Artista';

    // Set biography
    if (data.biography && data.biography.trim()) {
        biographyContentEl.innerHTML = `<p>${escapeHtml(data.biography)}</p>`;
    } else {
        biographyContentEl.innerHTML = '<p class="empty-state">Nenhuma biografia disponível.</p>';
    }

    // Set music list
    if (data.musicUrlsList && data.musicUrlsList.length > 0) {
        displayMusicList(data.musicUrlsList);
    } else {
        musicListEl.innerHTML = '<p class="empty-state">Nenhuma música adicionada.</p>';
    }

    // Show profile content
    profileContentEl.style.display = 'block';
}

// Display music list
function displayMusicList(musicUrls) {
    musicListEl.innerHTML = '';

    musicUrls.forEach((url, index) => {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        
        const musicIcon = document.createElement('div');
        musicIcon.className = 'music-icon';
        musicIcon.textContent = '🎵';
        
        const musicInfo = document.createElement('div');
        musicInfo.className = 'music-info';
        
        const musicTitle = document.createElement('h3');
        musicTitle.className = 'music-title';
        musicTitle.textContent = `Música ${index + 1}`;
        
        const musicUrl = document.createElement('p');
        musicUrl.className = 'music-url';
        musicUrl.textContent = url;
        
        musicInfo.appendChild(musicTitle);
        musicInfo.appendChild(musicUrl);
        
        const musicLink = document.createElement('a');
        musicLink.className = 'music-link';
        musicLink.href = url;
        musicLink.target = '_blank';
        musicLink.rel = 'noopener noreferrer';
        musicLink.textContent = 'Ouvir';
        
        musicItem.appendChild(musicIcon);
        musicItem.appendChild(musicInfo);
        musicItem.appendChild(musicLink);
        
        musicListEl.appendChild(musicItem);
    });
}

// Show not found message
function showNotFound() {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'none';
    profileContentEl.style.display = 'none';
    notFoundEl.style.display = 'block';
}

// Show error message
function showError() {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    profileContentEl.style.display = 'none';
    notFoundEl.style.display = 'none';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});
