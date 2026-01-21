# 🚀 Guia de Inicialização - MoveRap

## Pré-requisitos

- Java 17+ instalado
- Maven instalado
- Banco de dados configurado (PostgreSQL/MySQL)
- Python 3 ou Node.js (para servir o frontend)

## 🔧 Passo a Passo

### 1. Configurar o Backend

```bash
# Na raiz do projeto
mvn clean install

# Executar a aplicação
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 2. Servir o Frontend

Abra um **novo terminal** e navegue até a pasta frontend:

#### Opção A: Usando Python

```bash
cd frontend
python -m http.server 3000
```

#### Opção B: Usando Node.js

```bash
cd frontend
npx http-server -p 3000
```

#### Opção C: Usando Live Server (VS Code)

1. Instale a extensão "Live Server" no VS Code
2. Clique com botão direito em `frontend/index.html`
3. Selecione "Open with Live Server"

O frontend estará disponível em: `http://localhost:3000`

### 3. Testar a Aplicação

1. Acesse `http://localhost:3000` no navegador
2. Clique em "Cadastre-se"
3. Preencha o formulário:
   - Nome de usuário (mínimo 3 caracteres)
   - Email válido
   - Senha (mínimo 6 caracteres)
4. Após cadastro, você será redirecionado para o dashboard
5. Clique em "Criar Página" ou "Editar Página"
6. Preencha os campos:
   - Biografia (opcional, máx 1000 caracteres)
   - URL da foto de perfil (opcional)
   - URL da imagem de fundo (opcional)
   - URLs de músicas (clique em "+ Adicionar Música" para mais)
7. Clique em "Salvar Página"
8. Veja sua página em "Minha Página"

## 📊 Estrutura da Aplicação

```
MoveRap/
├── backend (Spring Boot)
│   ├── Controllers
│   │   ├── AuthController - Login/Cadastro
│   │   └── UserPageController - CRUD de páginas
│   ├── Services
│   └── Repositories
│
└── frontend (HTML/CSS/JS)
    ├── index.html - Login/Cadastro
    ├── dashboard.html - Dashboard
    ├── css/ - Estilos
    └── js/ - Lógica
```

## 🔑 Endpoints da API

### Autenticação
- `POST /auth/register` - Cadastrar usuário
- `POST /auth/login` - Login
- `GET /auth/me` - Dados do usuário atual

### Página do Usuário
- `POST /user-page/create` - Criar página
- `PUT /user-page/update` - Atualizar página
- `DELETE /user-page/delete` - Deletar página
- `GET /user-page/me` - Obter minha página

## 🎨 Recursos do Frontend

✅ Design moderno com tema dark
✅ Gradientes e animações suaves
✅ Responsivo (mobile e desktop)
✅ Validação de formulários
✅ Mensagens de erro/sucesso
✅ Navegação por abas
✅ Gestão de múltiplas músicas
✅ Preview da página em tempo real

## 🛠️ Tecnologias

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL/MySQL
- BCrypt para senhas

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- JavaScript (ES6+)
- Fetch API
- LocalStorage

## ⚠️ Troubleshooting

### Erro CORS
✅ **Solução**: CORS já está configurado no `SecurityConfig.java` para:
- `http://localhost:3000`
- `http://localhost:5500`
- `http://127.0.0.1:5500`

### Backend não inicia
- Verifique se a porta 8080 está livre
- Confirme configurações do banco em `application.yaml`
- Execute `mvn clean install` novamente

### Frontend não conecta
- Confirme que o backend está rodando
- Verifique se a URL em `js/auth.js` e `js/dashboard.js` está correta
- Abra o Console (F12) para ver erros

### Login não funciona
- Verifique credenciais
- Confirme que o usuário foi criado com sucesso
- Veja logs do backend

## 📝 Exemplo de Uso

```json
// Cadastro
POST http://localhost:8080/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "senha123"
}

// Login
POST http://localhost:8080/auth/login
{
  "email": "john@example.com",
  "password": "senha123"
}

// Criar Página
POST http://localhost:8080/user-page/create
{
  "biography": "Rapper e produtor musical",
  "profileImageUrl": "https://example.com/foto.jpg",
  "backgroundImageUrl": "https://example.com/fundo.jpg",
  "musicUrlsList": [
    "https://youtube.com/watch?v=xxx",
    "https://soundcloud.com/xxx"
  ]
}
```

## 🎯 Próximos Passos

1. ✅ Backend estruturado
2. ✅ Frontend criado
3. 🔄 Teste a aplicação completa
4. 📱 Compartilhe suas músicas!

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do backend
2. Abra o Console do navegador (F12)
3. Confirme que ambos servidores estão rodando
4. Teste os endpoints com Postman/Thunder Client

---

**Desenvolvido com 💜 para compartilhar música!**
