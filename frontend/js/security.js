/**
 * Módulo de Segurança - Funções para sanitização e validação
 * Previne ataques XSS (Cross-Site Scripting)
 */

/**
 * Sanitiza string HTML para prevenir XSS
 * Remove tags HTML e caracteres perigosos
 * @param {string} str - String para sanitizar
 * @returns {string} String sanitizada
 */
function sanitizeHTML(str) {
    if (!str) return '';
    
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

/**
 * Sanitiza URL para prevenir javascript: e data: URIs maliciosas
 * @param {string} url - URL para validar
 * @returns {string} URL sanitizada ou string vazia se inválida
 */
function sanitizeURL(url) {
    if (!url) return '';
    
    const trimmedUrl = url.trim().toLowerCase();
    
    // Bloquear protocolos perigosos
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    for (const protocol of dangerousProtocols) {
        if (trimmedUrl.startsWith(protocol)) {
            console.warn('[SECURITY] URL bloqueada por protocolo perigoso:', protocol);
            return '';
        }
    }
    
    // Permitir apenas http, https e URLs relativas
    if (trimmedUrl.startsWith('http://') || 
        trimmedUrl.startsWith('https://') || 
        trimmedUrl.startsWith('/') ||
        trimmedUrl.startsWith('./')) {
        return url.trim();
    }
    
    // Se não começar com protocolo válido, assumir https://
    return 'https://' + url.trim();
}

/**
 * Valida e sanitiza biografia
 * @param {string} biography - Texto da biografia
 * @returns {string} Biografia sanitizada
 */
function sanitizeBiography(biography) {
    if (!biography) return '';
    
    // Remove HTML tags
    let sanitized = sanitizeHTML(biography);
    
    // Limita tamanho
    if (sanitized.length > 1000) {
        sanitized = sanitized.substring(0, 1000);
    }
    
    return sanitized;
}

/**
 * Valida lista de URLs de música
 * @param {Array<string>} urls - Array de URLs
 * @returns {Array<string>} Array de URLs sanitizadas
 */
function sanitizeMusicUrls(urls) {
    if (!Array.isArray(urls)) return [];
    
    return urls
        .map(url => sanitizeURL(url))
        .filter(url => url !== ''); // Remove URLs inválidas
}

/**
 * Valida força da senha
 * @param {string} password - Senha para validar
 * @returns {Object} Objeto com resultado da validação
 */
function validatePasswordStrength(password) {
    const result = {
        valid: false,
        errors: [],
        strength: 'fraca'
    };
    
    if (!password) {
        result.errors.push('Senha é obrigatória');
        return result;
    }
    
    if (password.length < 8) {
        result.errors.push('Senha deve ter no mínimo 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
        result.errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (!/[a-z]/.test(password)) {
        result.errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
        result.errors.push('Senha deve conter pelo menos um número');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        result.errors.push('Senha deve conter pelo menos um caractere especial');
    }
    
    // Determinar força
    if (result.errors.length === 0) {
        result.valid = true;
        if (password.length >= 12) {
            result.strength = 'forte';
        } else if (password.length >= 10) {
            result.strength = 'média';
        }
    }
    
    return result;
}

/**
 * Valida email
 * @param {string} email - Email para validar
 * @returns {boolean} true se válido
 */
function validateEmail(email) {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida username
 * @param {string} username - Username para validar
 * @returns {Object} Objeto com resultado da validação
 */
function validateUsername(username) {
    const result = {
        valid: false,
        errors: []
    };
    
    if (!username) {
        result.errors.push('Nome de usuário é obrigatório');
        return result;
    }
    
    if (username.length < 3) {
        result.errors.push('Nome de usuário deve ter no mínimo 3 caracteres');
    }
    
    if (username.length > 50) {
        result.errors.push('Nome de usuário deve ter no máximo 50 caracteres');
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        result.errors.push('Nome de usuário pode conter apenas letras, números, hífen e underscore');
    }
    
    if (result.errors.length === 0) {
        result.valid = true;
    }
    
    return result;
}

/**
 * Remove credenciais do localStorage (logout seguro)
 */
function secureLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authCredentials');
    sessionStorage.clear();
}

/**
 * AVISO: Armazenar credenciais no localStorage é INSEGURO
 * Esta função documenta o risco existente no código atual
 */
function warningInsecureStorage() {
    console.warn(`
    ⚠️ AVISO DE SEGURANÇA ⚠️
    
    Credenciais estão sendo armazenadas em localStorage com Base64.
    Base64 NÃO é criptografia - pode ser facilmente decodificada!
    
    RECOMENDAÇÕES:
    1. Implementar autenticação via JWT tokens
    2. Armazenar apenas tokens (não senhas)
    3. Usar httpOnly cookies para tokens sensíveis
    4. Implementar refresh tokens
    5. Adicionar expiração de sessão
    
    Para produção, MIGRE para um sistema de autenticação mais seguro!
    `);
}

// Exportar funções
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeHTML,
        sanitizeURL,
        sanitizeBiography,
        sanitizeMusicUrls,
        validatePasswordStrength,
        validateEmail,
        validateUsername,
        secureLogout,
        warningInsecureStorage
    };
}
