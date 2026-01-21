// User Page specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initUserPage();
});

// Page state
const UserPageState = {
    currentData: {
        biography: '',
        profileImageUrl: '',
        backgroundImageUrl: '',
        musicUrls: ''
    },
    hasChanges: false,
    isLoading: false
};

function initUserPage() {
    console.log('Initializing user page editor...');
    
    // Check authentication
    if (!window.MoveRap || !window.MoveRap.AppState.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }

    // Update user info
    updateUserInfo();
    
    // Initialize event listeners
    initUserPageEventListeners();
    
    // Load existing user page data
    loadExistingPageData();
    
    // Initialize form validation
    initFormValidation();
}

function updateUserInfo() {
    const user = window.MoveRap.AppState.currentUser;
    if (user) {
        document.getElementById('sidebar-username').textContent = user.username;
        document.getElementById('preview-artist-name').textContent = user.username;
    }
}

function initUserPageEventListeners() {
    // Sidebar logout
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    
    // Header actions
    document.getElementById('save-page-btn')?.addEventListener('click', handleSavePage);
    document.getElementById('preview-page-btn')?.addEventListener('click', handlePreviewPage);
    
    // Form inputs with live preview
    const biographyInput = document.getElementById('biography-input');
    const profileImageInput = document.getElementById('profile-image-input');
    const backgroundImageInput = document.getElementById('background-image-input');
    const musicUrlsInput = document.getElementById('music-urls-input');
    
    if (biographyInput) {
        biographyInput.addEventListener('input', handleBiographyChange);
        biographyInput.addEventListener('input', updateCharCount);
    }
    
    if (profileImageInput) {
        profileImageInput.addEventListener('input', debounce(handleProfileImageChange, 500));
    }
    
    if (backgroundImageInput) {
        backgroundImageInput.addEventListener('input', debounce(handleBackgroundImageChange, 500));
    }
    
    if (musicUrlsInput) {
        musicUrlsInput.addEventListener('input', debounce(handleMusicUrlsChange, 500));
    }
    
    // Image test buttons
    document.getElementById('test-profile-image')?.addEventListener('click', () => {
        testImage(profileImageInput.value, 'profile');
    });
    
    document.getElementById('test-background-image')?.addEventListener('click', () => {
        testImage(backgroundImageInput.value, 'background');
    });
    
    // Form actions
    document.getElementById('reset-form-btn')?.addEventListener('click', handleResetForm);
    document.getElementById('page-edit-form')?.addEventListener('submit', handleFormSubmit);
    
    // Modal actions
    document.getElementById('use-image-btn')?.addEventListener('click', handleUseImage);
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            window.MoveRap.ModalManager.hideAll();
        });
    });
    
    // Warn about unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (UserPageState.hasChanges) {
            e.preventDefault();
            e.returnValue = 'Você tem alterações não salvas. Deseja sair mesmo assim?';
        }
    });
}

function handleBiographyChange(event) {
    const value = event.target.value;
    UserPageState.currentData.biography = value;
    UserPageState.hasChanges = true;
    
    // Update preview
    const previewBiography = document.getElementById('preview-biography');
    if (previewBiography) {
        previewBiography.textContent = value || 'Adicione sua biografia aqui...';
    }
}

function updateCharCount() {
    const textarea = document.getElementById('biography-input');
    const counter = document.getElementById('bio-char-count');
    
    if (textarea && counter) {
        const count = textarea.value.length;
        const maxCount = 500;
        
        counter.textContent = count;
        
        if (count > maxCount * 0.9) {
            counter.parentElement.classList.add('warning');
        } else {
            counter.parentElement.classList.remove('warning');
        }
        
        if (count > maxCount) {
            counter.parentElement.classList.add('error');
            textarea.value = textarea.value.substring(0, maxCount);
            counter.textContent = maxCount;
        } else {
            counter.parentElement.classList.remove('error');
        }
    }
}

function handleProfileImageChange(event) {
    const imageUrl = event.target.value.trim();
    UserPageState.currentData.profileImageUrl = imageUrl;
    UserPageState.hasChanges = true;
    
    if (imageUrl) {
        updatePreviewImage(imageUrl, 'profile');
    }
}

function handleBackgroundImageChange(event) {
    const imageUrl = event.target.value.trim();
    UserPageState.currentData.backgroundImageUrl = imageUrl;
    UserPageState.hasChanges = true;
    
    if (imageUrl) {
        updatePreviewImage(imageUrl, 'background');
    }
}

function handleMusicUrlsChange(event) {
    const musicUrls = event.target.value;
    UserPageState.currentData.musicUrls = musicUrls;
    UserPageState.hasChanges = true;
    
    updateMusicPreview(musicUrls);
}

function updatePreviewImage(imageUrl, type) {
    if (!imageUrl) return;
    
    const img = new Image();
    img.onload = function() {
        if (type === 'profile') {
            const previewImage = document.getElementById('preview-profile-image');
            if (previewImage) {
                previewImage.src = imageUrl;
            }
        } else if (type === 'background') {
            const pageBackground = document.getElementById('preview-background');
            if (pageBackground) {
                pageBackground.style.backgroundImage = `url("${imageUrl}")`;
            }
        }
    };
    
    img.onerror = function() {
        if (type === 'profile') {
            window.MoveRap.AlertSystem.warning('Não foi possível carregar a imagem de perfil');
        } else {
            window.MoveRap.AlertSystem.warning('Não foi possível carregar a imagem de fundo');
        }
    };
    
    img.src = imageUrl;
}

function updateMusicPreview(musicUrls) {
    const musicList = document.getElementById('preview-music-list');
    if (!musicList) return;
    
    const urls = musicUrls.split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
    
    if (urls.length === 0) {
        musicList.innerHTML = `
            <div class="music-placeholder">
                <i class="fas fa-music"></i>
                <p>Suas músicas aparecerão aqui quando você adicionar os links</p>
            </div>
        `;
        return;
    }
    
    const musicItems = urls.map((url, index) => {
        const platform = detectMusicPlatform(url);
        const title = `Música ${index + 1}`;
        
        return `
            <div class="music-item">
                <div class="music-icon">
                    <i class="${platform.icon}"></i>
                </div>
                <div class="music-info">
                    <div class="music-title">${title}</div>
                    <div class="music-platform">${platform.name}</div>
                </div>
            </div>
        `;
    }).join('');
    
    musicList.innerHTML = musicItems;
}

function detectMusicPlatform(url) {
    if (url.includes('spotify.com')) {
        return { name: 'Spotify', icon: 'fab fa-spotify' };
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return { name: 'YouTube', icon: 'fab fa-youtube' };
    } else if (url.includes('soundcloud.com')) {
        return { name: 'SoundCloud', icon: 'fab fa-soundcloud' };
    } else if (url.includes('apple.com')) {
        return { name: 'Apple Music', icon: 'fas fa-music' };
    } else {
        return { name: 'Link de Música', icon: 'fas fa-external-link-alt' };
    }
}

function testImage(imageUrl, type) {
    if (!imageUrl.trim()) {
        window.MoveRap.AlertSystem.warning('Por favor, insira uma URL de imagem primeiro');
        return;
    }
    
    // Show loading
    const testBtn = document.getElementById(type === 'profile' ? 'test-profile-image' : 'test-background-image');
    const originalHtml = testBtn.innerHTML;
    testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testando...';
    testBtn.disabled = true;
    
    // Test image loading
    const img = new Image();
    
    img.onload = function() {
        // Show preview modal
        const previewImg = document.getElementById('image-preview');
        const modal = document.getElementById('image-preview-modal');
        const useBtn = document.getElementById('use-image-btn');
        
        if (previewImg && modal && useBtn) {
            previewImg.src = imageUrl;
            useBtn.setAttribute('data-image-url', imageUrl);
            useBtn.setAttribute('data-image-type', type);
            window.MoveRap.ModalManager.show('image-preview-modal');
        }
        
        // Restore button
        testBtn.innerHTML = originalHtml;
        testBtn.disabled = false;
    };
    
    img.onerror = function() {
        window.MoveRap.AlertSystem.error('Não foi possível carregar a imagem. Verifique se a URL está correta.');
        
        // Restore button
        testBtn.innerHTML = originalHtml;
        testBtn.disabled = false;
    };
    
    img.src = imageUrl;
}

function handleUseImage() {
    const useBtn = document.getElementById('use-image-btn');
    const imageUrl = useBtn.getAttribute('data-image-url');
    const imageType = useBtn.getAttribute('data-image-type');
    
    if (imageUrl && imageType) {
        // Update the input field
        const input = document.getElementById(imageType === 'profile' ? 'profile-image-input' : 'background-image-input');
        if (input) {
            input.value = imageUrl;
            
            // Trigger change event to update preview
            if (imageType === 'profile') {
                handleProfileImageChange({ target: input });
            } else {
                handleBackgroundImageChange({ target: input });
            }
        }
        
        window.MoveRap.AlertSystem.success('Imagem aplicada com sucesso!');
        window.MoveRap.ModalManager.hideAll();
    }
}

function handleResetForm() {
    if (confirm('Tem certeza que deseja resetar todas as alterações? Esta ação não pode ser desfeita.')) {
        // Reset form
        document.getElementById('page-edit-form').reset();
        
        // Reset state
        UserPageState.currentData = {
            biography: '',
            profileImageUrl: '',
            backgroundImageUrl: '',
            musicUrls: ''
        };
        UserPageState.hasChanges = false;
        
        // Reset preview
        resetPreview();
        
        window.MoveRap.AlertSystem.info('Formulário resetado');
    }
}

function resetPreview() {
    const user = window.MoveRap.AppState.currentUser;
    
    // Reset profile image
    const previewImage = document.getElementById('preview-profile-image');
    if (previewImage) {
        previewImage.src = 'https://via.placeholder.com/150x150?text=Foto';
    }
    
    // Reset background
    const pageBackground = document.getElementById('preview-background');
    if (pageBackground) {
        pageBackground.style.backgroundImage = '';
    }
    
    // Reset biography
    const previewBiography = document.getElementById('preview-biography');
    if (previewBiography) {
        previewBiography.textContent = 'Adicione sua biografia aqui...';
    }
    
    // Reset artist name
    const artistName = document.getElementById('preview-artist-name');
    if (artistName && user) {
        artistName.textContent = user.username;
    }
    
    // Reset music list
    const musicList = document.getElementById('preview-music-list');
    if (musicList) {
        musicList.innerHTML = `
            <div class="music-placeholder">
                <i class="fas fa-music"></i>
                <p>Suas músicas aparecerão aqui quando você adicionar os links</p>
            </div>
        `;
    }
    
    // Reset character count
    updateCharCount();
}

async function handleFormSubmit(event) {
    event.preventDefault();
    await handleSavePage();
}

async function handleSavePage() {
    if (UserPageState.isLoading) return;
    
    try {
        UserPageState.isLoading = true;
        
        // Update save button
        const saveBtn = document.getElementById('save-page-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            saveBtn.disabled = true;
        }
        
        // Prepare data
        const pageData = {
            biography: UserPageState.currentData.biography || '',
            profileImageUrl: UserPageState.currentData.profileImageUrl || '',
            backgroundImageUrl: UserPageState.currentData.backgroundImageUrl || '',
            musicUrls: UserPageState.currentData.musicUrls || ''
        };
        
        console.log('Saving user page:', pageData);
        
        // Save via API
        await window.MoveRap.UserPageService.updateUserPage(pageData);
        
        UserPageState.hasChanges = false;
        window.MoveRap.AlertSystem.success('Página salva com sucesso!');
        
    } catch (error) {
        console.error('Error saving user page:', error);
        window.MoveRap.AlertSystem.error('Erro ao salvar página: ' + error.message);
    } finally {
        UserPageState.isLoading = false;
        
        // Restore save button
        const saveBtn = document.getElementById('save-page-btn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
            saveBtn.disabled = false;
        }
    }
}

function handlePreviewPage() {
    window.MoveRap.AlertSystem.info('Visualização em página completa em desenvolvimento');
    // This would open the page in a new tab/window for full preview
}

async function loadExistingPageData() {
    try {
        const data = await window.MoveRap.ApiClient.get('/user-page/me', {
            credentials: 'include'
        });
        if (data) {
            document.getElementById('biography-input').value = data.biography || '';
            handleBiographyChange({ target: { value: data.biography || '' } });

            document.getElementById('profile-image-input').value = data.profileImageUrl || '';
            handleProfileImageChange({ target: { value: data.profileImageUrl || '' } });

            document.getElementById('background-image-input').value = data.backgroundImageUrl || '';
            handleBackgroundImageChange({ target: { value: data.backgroundImageUrl || '' } });

            document.getElementById('music-urls-input').value = data.musicUrls || '';
            handleMusicUrlsChange({ target: { value: data.musicUrls || '' } });
        }
    } catch (error) {
        console.error('Erro ao carregar dados da página:', error);
    }
}

function initFormValidation() {
    // Add real-time validation for URL inputs
    const urlInputs = [
        document.getElementById('profile-image-input'),
        document.getElementById('background-image-input')
    ];
    
    urlInputs.forEach(input => {
        if (input) {
            input.addEventListener('blur', validateUrlInput);
        }
    });
}

function validateUrlInput(event) {
    const input = event.target;
    const value = input.value.trim();
    
    if (value && !isValidUrl(value)) {
        input.classList.add('error');
        showInputError(input, 'Por favor, insira uma URL válida');
    } else {
        input.classList.remove('error');
        hideInputError(input);
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showInputError(input, message) {
    hideInputError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.parentElement.appendChild(errorDiv);
}

function hideInputError(input) {
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleLogout() {
    if (UserPageState.hasChanges) {
        if (!confirm('Você tem alterações não salvas. Deseja sair mesmo assim?')) {
            return;
        }
    }
    
    if (confirm('Tem certeza que deseja sair?')) {
        window.MoveRap.AuthService.logout();
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