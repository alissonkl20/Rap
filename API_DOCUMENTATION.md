# 📚 Documentação da API - MoveRap

## 🔐 Autenticação

A API usa **HTTP Basic Authentication** para proteger os endpoints sensíveis.

### Como Autenticar
Para acessar endpoints protegidos (POST, PUT, DELETE), envie as credenciais no header:
```
Authorization: Basic base64(username:password)
```

---

## 📝 Endpoints

### **Autenticação**

#### 1️⃣ Registrar Usuário
**POST** `/auth/register`

**Descrição:** Cria um novo usuário no sistema

**Body:**
```json
{
  "username": "seu_nome_usuario",
  "email": "seuemail@example.com",
  "password": "suasenha123"
}
```

**Validações:**
- `username`: Obrigatório, 3-50 caracteres
- `email`: Obrigatório, formato válido de email
- `password`: Obrigatório, mínimo 6 caracteres

**Resposta Sucesso (201):**
```json
{
  "id": 1,
  "username": "seu_nome_usuario",
  "email": "seuemail@example.com"
}
```

---

#### 2️⃣ Login
**POST** `/auth/login`

**Descrição:** Valida credenciais do usuário

**Body:**
```json
{
  "email": "seuemail@example.com",
  "senha": "suasenha123"
}
```

**Resposta Sucesso (200):**
```json
{
  "id": 1,
  "username": "seu_nome_usuario",
  "email": "seuemail@example.com"
}
```

**Resposta Erro (401):**
```json
{
  "message": "Credenciais inválidas"
}
```

---

#### 3️⃣ Obter Usuário Atual
**GET** `/auth/me`

**Descrição:** Retorna dados do usuário autenticado

**Autenticação:** 🔒 Requerida

**Resposta Sucesso (200):**
```json
{
  "id": 1,
  "username": "seu_nome_usuario",
  "email": "seuemail@example.com"
}
```

---

### **Página do Usuário (Perfil do Artista)**

#### 4️⃣ Criar Página do Artista
**POST** `/user-page/create`

**Descrição:** Cria página do perfil do artista com biografia, imagens e links de músicas

**Autenticação:** 🔒 Requerida

**Body:**
```json
{
  "biography": "Biografia do artista...",
  "profileImageUrl": "https://example.com/perfil.jpg",
  "backgroundImageUrl": "https://example.com/fundo.jpg",
  "musicUrlsList": [
    "https://open.spotify.com/track/xxx",
    "https://www.youtube.com/watch?v=xxx",
    "https://soundcloud.com/xxx"
  ]
}
```

**Validações:**
- `biography`: Máximo 1000 caracteres
- `musicUrlsList`: Lista de URLs (aceita Spotify, YouTube, SoundCloud, etc.)

**Resposta Sucesso (201):**
```json
{
  "id": 1,
  "user": {...},
  "biography": "Biografia do artista...",
  "profileImageUrl": "https://example.com/perfil.jpg",
  "backgroundImageUrl": "https://example.com/fundo.jpg",
  "musicUrls": "..."
}
```

---

#### 5️⃣ Atualizar Página do Artista
**PUT** `/user-page/update`

**Descrição:** Atualiza dados da página do artista

**Autenticação:** 🔒 Requerida (apenas o próprio usuário pode atualizar)

**Body:** (mesmo formato do create)

**Resposta Sucesso (200):**
```json
{
  "message": "Página do usuário atualizada com sucesso."
}
```

---

#### 6️⃣ Deletar Página do Artista
**DELETE** `/user-page/delete`

**Descrição:** Remove a página do artista

**Autenticação:** 🔒 Requerida (apenas o próprio usuário pode deletar)

**Resposta Sucesso (200):**
```json
"Página do usuário excluída com sucesso."
```

---

#### 7️⃣ Obter Minha Página
**GET** `/user-page/me`

**Descrição:** Retorna a página do usuário autenticado

**Autenticação:** 🔒 Requerida

**Resposta Sucesso (200):**
```json
{
  "biography": "Biografia do artista...",
  "profileImageUrl": "https://example.com/perfil.jpg",
  "backgroundImageUrl": "https://example.com/fundo.jpg",
  "musicUrlsList": [
    "https://open.spotify.com/track/xxx",
    "https://www.youtube.com/watch?v=xxx"
  ]
}
```

---

## ⚠️ Códigos de Erro

| Código | Significado |
|--------|-------------|
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Dados duplicados (email/username já existe) |
| 500 | Internal Server Error - Erro no servidor |

---

## 🛡️ Segurança Implementada

✅ **Senhas criptografadas** com BCrypt  
✅ **Autenticação HTTP Basic**  
✅ **Validações de entrada** em todos endpoints  
✅ **Autorização por usuário** (apenas dono pode modificar)  
✅ **Tratamento global de exceções**  
✅ **CORS configurado** para desenvolvimento  
✅ **Proteção contra SQL Injection** (JPA/Hibernate)  

---

## 📌 Observações

1. **Autenticação HTTP Basic é temporária** - Recomenda-se implementar JWT para produção
2. Cada usuário pode ter apenas **uma UserPage**
3. Links de música aceitam **qualquer plataforma** (Spotify, YouTube, SoundCloud, etc.)
4. Endpoints GET são **públicos** (exceto `/me`)
5. Senha do banco de dados deve ser movida para **variáveis de ambiente**

---

## 🚀 Exemplo de Uso (cURL)

### Registrar
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "mc_exemplo",
    "email": "mc@example.com",
    "password": "senha123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mc@example.com",
    "senha": "senha123"
  }'
```

### Criar Página (autenticado)
```bash
curl -X POST http://localhost:8080/user-page/create \
  -u mc_exemplo:senha123 \
  -H "Content-Type: application/json" \
  -d '{
    "biography": "MC de São Paulo, representando o RAP nacional!",
    "profileImageUrl": "https://example.com/foto.jpg",
    "backgroundImageUrl": "https://example.com/fundo.jpg",
    "musicUrlsList": [
      "https://open.spotify.com/track/123",
      "https://www.youtube.com/watch?v=456"
    ]
  }'
```
