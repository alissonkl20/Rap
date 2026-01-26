/**
 * API Helper - Centraliza todas as requisições autenticadas
 * Garante que POST, PUT e DELETE sempre enviem credenciais de autenticação
 */

const API_URL = 'http://localhost:8080';

/**
 * Obtém as credenciais de autenticação armazenadas
 * @returns {string|null} Credenciais codificadas em Base64 ou null
 */
function getAuthCredentials() {
    return localStorage.getItem('authCredentials');
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} true se autenticado, false caso contrário
 */
function isAuthenticated() {
    return !!localStorage.getItem('user') && !!getAuthCredentials();
}

/**
 * Realiza uma requisição autenticada à API
 * @param {string} endpoint - Endpoint da API (ex: '/user-page/me')
 * @param {object} options - Opções da requisição (method, body, headers, etc.)
 * @returns {Promise<Response>} Resposta da requisição
 */
async function authenticatedFetch(endpoint, options = {}) {
    const authCredentials = getAuthCredentials();
    
    // Configurações padrão
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };
    
    // Adiciona autenticação se disponível
    if (authCredentials) {
        defaultHeaders['Authorization'] = `Basic ${authCredentials}`;
    }
    
    // Remove Content-Type se for FormData (será definido automaticamente)
    if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
    }
    
    // Merge das opções
    const fetchOptions = {
        ...options,
        credentials: 'include',
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, fetchOptions);
        
        // Se retornar 401 (Não autorizado), redireciona para login
        if (response.status === 401) {
            console.warn('Sessão expirada ou não autorizado');
            localStorage.removeItem('user');
            localStorage.removeItem('authCredentials');
            window.location.href = 'index.html';
            throw new Error('Não autorizado');
        }
        
        return response;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

/**
 * Requisição GET autenticada
 * @param {string} endpoint - Endpoint da API
 * @returns {Promise<any>} Dados da resposta em JSON
 */
async function apiGet(endpoint) {
    const response = await authenticatedFetch(endpoint, {
        method: 'GET'
    });
    
    if (!response.ok) {
        throw new Error(`Erro na requisição GET: ${response.statusText}`);
    }
    
    return response.json();
}

/**
 * Requisição POST autenticada
 * @param {string} endpoint - Endpoint da API
 * @param {object|FormData} data - Dados a serem enviados
 * @returns {Promise<any>} Dados da resposta em JSON
 */
async function apiPost(endpoint, data) {
    const isFormData = data instanceof FormData;
    
    const response = await authenticatedFetch(endpoint, {
        method: 'POST',
        body: isFormData ? data : JSON.stringify(data)
    });
    
    return response;
}

/**
 * Requisição PUT autenticada
 * @param {string} endpoint - Endpoint da API
 * @param {object|FormData} data - Dados a serem atualizados
 * @returns {Promise<any>} Dados da resposta em JSON
 */
async function apiPut(endpoint, data) {
    const isFormData = data instanceof FormData;
    
    const response = await authenticatedFetch(endpoint, {
        method: 'PUT',
        body: isFormData ? data : JSON.stringify(data)
    });
    
    return response;
}

/**
 * Requisição DELETE autenticada
 * @param {string} endpoint - Endpoint da API
 * @returns {Promise<any>} Dados da resposta em JSON
 */
async function apiDelete(endpoint) {
    const response = await authenticatedFetch(endpoint, {
        method: 'DELETE'
    });
    
    return response;
}

/**
 * Upload de arquivo autenticado
 * @param {string} endpoint - Endpoint da API
 * @param {File} file - Arquivo a ser enviado
 * @param {object} additionalData - Dados adicionais do formulário
 * @returns {Promise<any>} Dados da resposta em JSON
 */
async function apiUpload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Adiciona dados adicionais ao FormData
    Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
    });
    
    const response = await authenticatedFetch(endpoint, {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        let errorMessage = 'Erro no upload';
        try {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }
    
    return response.json();
}
