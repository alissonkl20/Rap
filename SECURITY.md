# 🔐 Configuração de Segurança e Autenticação

## Visão Geral

Este projeto implementa autenticação **HTTP Basic** para proteger todas as operações que modificam dados (POST, PUT, DELETE).

## Backend - Spring Security

### Regras de Autenticação

O arquivo [SecurityConfig.java](src/main/java/com/MoveRap/demo/config/SecurityConfig.java) define as seguintes regras:

#### ✅ Rotas que REQUEREM Autenticação:
- **Todos os métodos POST** (`/**`)
- **Todos os métodos PUT** (`/**`)
- **Todos os métodos DELETE** (`/**`)
- `/user-page/me` (informações do usuário logado)
- `/api/**` (todos os endpoints de API)

#### 🌐 Rotas Públicas (sem autenticação):
- `/`, `/index`, `/index.html` (página inicial)
- `/css/**`, `/scripts/**`, `/static/**` (recursos estáticos)
- `/uploads/**` (imagens públicas)
- `GET /user-page` (visualização pública de páginas)
- `GET /user-page/public/**` (perfis públicos)

### Como Funciona a Autenticação

1. **Registro**: Usuário cria uma conta com username, email e senha
2. **Login**: Credenciais são validadas e codificadas em Base64
3. **Armazenamento**: Credenciais ficam em `localStorage` no formato `email:password` (Base64)
4. **Requisições**: Toda requisição POST/PUT/DELETE envia header `Authorization: Basic {credenciais}`

### Configuração CORS

O backend permite requisições de:
- `http://localhost:8080` (Spring Boot)
- `http://localhost:3000` (Frontend local)
- `http://127.0.0.1:5500` (Live Server)
- `http://localhost:5500` (Live Server alternativo)
- `null` (arquivos abertos diretamente)

## Frontend - JavaScript

### Arquivos Principais

1. **[auth.js](frontend/js/auth.js)**: Login e registro
2. **[dashboard.js](frontend/js/dashboard.js)**: Gerenciamento de páginas
3. **[api.js](frontend/js/api.js)**: Helper centralizado para requisições autenticadas ⭐ NOVO

### Como Usar as Credenciais no Frontend

#### ❌ Forma ANTIGA (não use):
```javascript
fetch(`${API_URL}/user-page/create`, {
    method: 'POST',
    body: JSON.stringify(data)
});
```

#### ✅ Forma CORRETA:
```javascript
// Opção 1: Usando o helper api.js (RECOMENDADO)
const response = await apiPost('/user-page/create', data);

// Opção 2: Manualmente
const authCredentials = localStorage.getItem('authCredentials');
fetch(`${API_URL}/user-page/create`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authCredentials}`
    },
    credentials: 'include',
    body: JSON.stringify(data)
});
```

### API Helper (api.js)

O arquivo `api.js` fornece funções utilitárias que **automaticamente** incluem credenciais:

```javascript
// GET
const userData = await apiGet('/user-page/me');

// POST
const response = await apiPost('/user-page/create', { biography: 'Minha bio' });

// PUT
const response = await apiPut('/user-page/update', { biography: 'Nova bio' });

// DELETE
const response = await apiDelete('/user-page/delete');

// Upload de arquivo
const result = await apiUpload('/api/upload/image', file, { type: 'profile' });
```

### Proteção Automática

O helper `api.js` também:
- ✅ Detecta respostas 401 (não autorizado)
- ✅ Remove credenciais inválidas
- ✅ Redireciona para página de login automaticamente
- ✅ Sempre envia `credentials: 'include'`

## Como Incluir api.js nas Páginas

Adicione antes dos outros scripts:

```html
<!-- API Helper - DEVE vir primeiro -->
<script src="js/api.js"></script>

<!-- Outros scripts -->
<script src="js/dashboard.js"></script>
```

## Testando a Autenticação

### 1. Testar Sem Autenticação (deve falhar):
```bash
curl -X POST http://localhost:8080/user-page/create \
  -H "Content-Type: application/json" \
  -d '{"biography":"teste"}'
```
**Resultado esperado**: `401 Unauthorized`

### 2. Testar Com Autenticação (deve funcionar):
```bash
# Primeiro, codifique suas credenciais em Base64
# echo -n "seu-email@example.com:sua-senha" | base64

curl -X POST http://localhost:8080/user-page/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic c2V1LWVtYWlsQGV4YW1wbGUuY29tOnN1YS1zZW5oYQ==" \
  -d '{"biography":"teste"}'
```
**Resultado esperado**: `200 OK` ou `201 Created`

## Fluxo Completo de Autenticação

```
1. Usuário acessa index.html
   ↓
2. Clica em "Registrar" ou "Login"
   ↓
3. Envia credenciais → POST /auth/register ou /auth/login
   ↓
4. Backend valida e retorna dados do usuário
   ↓
5. Frontend salva:
   - localStorage.setItem('user', JSON.stringify(userData))
   - localStorage.setItem('authCredentials', btoa(`${email}:${password}`))
   ↓
6. Redireciona para dashboard.html
   ↓
7. Dashboard verifica autenticação:
   - Se não autenticado → redireciona para index.html
   - Se autenticado → carrega dados do usuário
   ↓
8. Todas as requisições POST/PUT/DELETE incluem:
   - Header: Authorization: Basic {authCredentials}
   - credentials: 'include'
```

## Segurança

### ⚠️ Avisos Importantes

1. **HTTP Basic é seguro apenas com HTTPS**: Em produção, use HTTPS obrigatoriamente
2. **Não compartilhe authCredentials**: São credenciais sensíveis em Base64
3. **Senhas no localStorage**: Em produção, considere usar JWT tokens com expiração

### 🔒 Boas Práticas Implementadas

- ✅ CSRF desabilitado (ok para APIs REST stateless)
- ✅ CORS configurado para origens específicas
- ✅ Senhas criptografadas com BCrypt
- ✅ Validação de credenciais no backend
- ✅ Proteção de rotas sensíveis
- ✅ Redirecionamento automático em 401

## Solução de Problemas

### Erro: "401 Unauthorized" em requisições POST/PUT/DELETE

**Causa**: Credenciais não estão sendo enviadas

**Solução**:
1. Verifique se `authCredentials` existe no localStorage:
   ```javascript
   console.log(localStorage.getItem('authCredentials'));
   ```

2. Certifique-se de incluir o header `Authorization`:
   ```javascript
   headers: {
       'Authorization': `Basic ${authCredentials}`
   }
   ```

3. Use o helper `api.js` que faz isso automaticamente

### Erro: "CORS policy blocked"

**Causa**: Origem não permitida no backend

**Solução**: Adicione sua origem em `SecurityConfig.java`:
```java
configuration.addAllowedOrigin("http://seu-dominio:porta");
```

### Erro: "Session expired or unauthorized"

**Causa**: Credenciais inválidas ou removidas

**Solução**: Faça login novamente

## Referências

- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)
- [HTTP Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
