# 🎵 MoveRap - Frontend

Frontend moderno e responsivo para a aplicação MoveRap.

## 📁 Estrutura

```
frontend/
├── index.html          # Página de login/cadastro
├── dashboard.html      # Dashboard do usuário
├── css/
│   ├── style.css      # Estilos gerais
│   └── dashboard.css  # Estilos do dashboard
└── js/
    ├── auth.js        # Lógica de autenticação
    └── dashboard.js   # Lógica do dashboard
```

## 🚀 Funcionalidades

### Autenticação
- ✅ Login de usuário
- ✅ Cadastro de novo usuário
- ✅ Validação de formulários
- ✅ Mensagens de erro amigáveis

### Dashboard
- ✅ Visualização da página do usuário
- ✅ Criação de página personalizada
- ✅ Edição de biografia (máx 1000 caracteres)
- ✅ Upload de foto de perfil (URL)
- ✅ Upload de imagem de fundo (URL)
- ✅ Adição de múltiplas URLs de músicas
- ✅ Exclusão de página
- ✅ Visualização de perfil

## 🎨 Design

- **Tema**: Dark mode com gradiente roxo/azul
- **Responsivo**: Funciona em desktop e mobile
- **Animações**: Transições suaves
- **UX**: Interface intuitiva e moderna

## ⚙️ Configuração

1. **Backend URL**: Por padrão, o frontend está configurado para se conectar em `http://localhost:8080`

   Se precisar alterar a URL do backend, edite em:
   - `frontend/js/auth.js` (linha 1)
   - `frontend/js/dashboard.js` (linha 1)

2. **CORS**: Certifique-se de que o backend está configurado para aceitar requisições do frontend.

## 🌐 Como usar

### Opção 1: Servidor Local (Recomendado)

Abra um terminal na pasta `frontend` e execute:

```bash
# Com Python 3
python -m http.server 3000

# Com Node.js (http-server)
npx http-server -p 3000
```

Acesse: `http://localhost:3000`

### Opção 2: Abrir diretamente

Abra o arquivo `frontend/index.html` no navegador.

**Nota**: Alguns navegadores podem bloquear requisições CORS ao abrir arquivos localmente. Use a Opção 1 se tiver problemas.

## 📱 Páginas

### Index (Login/Cadastro)
- Login com email e senha
- Cadastro com username, email e senha
- Toggle entre formulários

### Dashboard
- **Minha Página**: Visualiza sua página pública
- **Editar Página**: Cria/edita conteúdo da página
- **Perfil**: Visualiza informações da conta

## 🔑 API Endpoints Utilizados

- `POST /auth/login` - Login
- `POST /auth/register` - Cadastro
- `GET /auth/me` - Dados do usuário autenticado
- `POST /user-page/create` - Criar página
- `PUT /user-page/update` - Atualizar página
- `DELETE /user-page/delete` - Deletar página
- `GET /user-page/me` - Obter página do usuário

## 🎯 Próximos Passos

1. Iniciar o backend na porta 8080
2. Abrir o frontend em um servidor local
3. Criar uma conta
4. Personalizar sua página
5. Compartilhar suas músicas!

## 🐛 Troubleshooting

**Erro CORS**: Configure o CORS no backend (já incluído no SecurityConfig)

**Login não funciona**: Verifique se o backend está rodando na porta 8080

**Página não carrega**: Verifique o console do navegador (F12) para erros
