# Move Rap Frontend

Uma aplicação frontend moderna para a plataforma **Move Rap** - conectando rappers, produtores e fãs da cultura Hip-Hop brasileira.

## 📋 Visão Geral

Este frontend fornece uma interface completa para interagir com a API backend Move Rap, incluindo:

- ✨ **Landing Page** - Página inicial atrativa com animações
- 🔐 **Sistema de Autenticação** - Login e registro de usuários
- 📊 **Dashboard** - Painel principal com estatísticas e ações rápidas
- 🎤 **Página do Artista** - Editor completo para customizar perfil artístico
- 📱 **Design Responsivo** - Funciona perfeitamente em qualquer dispositivo

## 🚀 Funcionalidades

### Autenticação
- **Registro de novos usuários**
- **Login/logout seguro**
- **Validação de formulários em tempo real**
- **Gerenciamento de estado de sessão**

### Dashboard
- **Estatísticas do perfil** (visualizações, likes, seguidores, músicas)
- **Atividade recente** do usuário
- **Ações rápidas** para principais funcionalidades
- **Navegação intuitiva** entre seções

### Editor de Página do Artista
- **Preview em tempo real** das alterações
- **Upload de imagens** (perfil e fundo)
- **Editor de biografia** com contador de caracteres
- **Gerenciamento de links** para músicas (Spotify, YouTube, SoundCloud, etc.)
- **Validação de URLs** para imagens e músicas

### Design e UX
- **Tema escuro moderno** otimizado para a cultura Hip-Hop
- **Animações suaves** e transições fluidas
- **Sistema de notificações** para feedback do usuário
- **Layout responsivo** para desktop, tablet e mobile

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com CSS Grid/Flexbox
- **JavaScript (ES6+)** - Funcionalidades interativas
- **Fetch API** - Comunicação com backend
- **Font Awesome** - Ícones profissionais
- **Google Fonts (Inter)** - Tipografia moderna

## 📁 Estrutura do Projeto

```
frontend/
├── index.html          # Landing page principal
├── dashboard.html      # Painel do usuário
├── user-page.html      # Editor da página do artista
├── styles.css          # Estilos globais e componentes
├── dashboard.css       # Estilos específicos do dashboard
├── user-page.css       # Estilos do editor de página
├── script.js           # JavaScript principal
├── dashboard.js        # Lógica do dashboard
├── user-page.js        # Lógica do editor de página
└── README.md           # Este arquivo
```

## 🔧 Configuração e Uso

### 1. Configurar o Backend
Certifique-se de que sua aplicação Spring Boot está rodando em `http://localhost:8080`

### 2. Configurar CORS
O backend já está configurado para aceitar requisições do frontend. A configuração está em `SecurityConfig.java`.

### 3. Abrir o Frontend
Você pode usar qualquer servidor web local. Algumas opções:

#### Opção A: Live Server (VS Code)
```bash
# Instale a extensão Live Server no VS Code
# Clique com botão direito em index.html
# Selecione "Open with Live Server"
```

#### Opção B: Python HTTP Server
```bash
cd frontend
python -m http.server 3000
# Acesse: http://localhost:3000
```

#### Opção C: Node.js HTTP Server
```bash
cd frontend
npx http-server -p 3000
# Acesse: http://localhost:3000
```

## 🎯 Como Usar

### 1. Acessar a Aplicação
- Abra `http://localhost:3000` (ou porta configurada)
- Você verá a landing page com animações

### 2. Criar uma Conta
- Clique em "Cadastrar" ou "Começar Agora"
- Preencha: usuário, email, senha
- Confirme a senha
- Clique em "Criar Conta"

### 3. Fazer Login
- Após criar conta, clique em "Entrar"
- Digite usuário/email e senha
- Clique em "Entrar"

### 4. Explorar o Dashboard
- Veja suas estatísticas
- Explore as ações rápidas
- Acompanhe atividade recente

### 5. Criar Página de Artista
- No dashboard, clique em "Criar Página"
- Preencha biografia (obrigatório)
- Adicione URLs de imagens (opcional)
- Adicione links de músicas (opcional)
- Clique em "Criar Página"

### 6. Editar Página do Artista
- Acesse "Minha Página" no menu
- Use o editor à direita para fazer alterações
- Veja preview em tempo real à esquerda
- Teste imagens antes de aplicar
- Salve as alterações

## 🔌 Integração com API

O frontend se conecta aos seguintes endpoints:

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login de usuário
- `GET /auth/me` - Dados do usuário atual

### Página do Usuário
- `POST /user-page/create` - Criar página
- `POST /user-page/update` - Atualizar página
- `PUT /user-page/update-image` - Atualizar imagens
- `DELETE /user-page/delete` - Excluir página

## 🎨 Customização

### Cores e Tema
As variáveis CSS estão em `:root` no `styles.css`:

```css
:root {
    --primary-color: #ff6b35;    /* Cor principal */
    --secondary-color: #2c3e50;  /* Cor secundária */
    --background: #1a1a1a;       /* Fundo principal */
    --surface: #2d2d2d;          /* Superfícies */
    --text-primary: #ffffff;     /* Texto principal */
    /* ... outras variáveis */
}
```

### Adicionando Novas Páginas
1. Crie arquivo HTML na pasta `frontend/`
2. Adicione estilos específicos em CSS próprio
3. Crie arquivo JavaScript para funcionalidades
4. Integre com `PageManager` em `script.js`

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Erro de CORS
- **Problema**: Console mostra erro de CORS
- **Solução**: Verifique se o backend está rodando e CORS configurado

#### 2. API não responde
- **Problema**: Requests falham
- **Solução**: Confirme que backend está em `http://localhost:8080`

#### 3. Imagens não carregam
- **Problema**: URLs de imagem não funcionam
- **Solução**: Use URLs públicas (Imgur, Google Drive público, etc.)

#### 4. Página não carrega após login
- **Problema**: Fica na landing page
- **Solução**: Verifique console do navegador e response da API

### Logs de Debug
Abra DevTools (F12) no navegador para ver logs detalhados.

## 🚀 Próximos Passos

### Funcionalidades Planejadas
- [ ] Sistema de upload de arquivos para imagens
- [ ] Player de música integrado
- [ ] Sistema de comentários e interações
- [ ] Busca e descoberta de artistas
- [ ] Sistema de notificações em tempo real
- [ ] Analytics detalhados
- [ ] Sistema de mensagens privadas

### Melhorias Técnicas
- [ ] Service Workers para funcionamento offline
- [ ] Otimização de imagens automática
- [ ] Lazy loading de componentes
- [ ] Testes automatizados
- [ ] Build process com bundler

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja arquivo `LICENSE` para detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através dos canais oficiais do Move Rap.

---

**Move Rap** - Conectando a cultura Hip-Hop brasileira 🎤🔥