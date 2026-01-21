# Interface Move Rap - Landing Page

## 📌 Visão Geral

Interface moderna e animada para o Move Rap com landing page, modais de login e cadastro.

## ✨ Características

### Landing Page
- **Logo Animado**: Ícone musical com animação de bounce
- **Nome da Marca**: "MoveRap" com destaque dourado e efeito de brilho
- **Slogan**: "Compartilhe sua música com o mundo"

### Cards de Features
1. **Crie sua Página** 🎤
   - Monte seu perfil artístico personalizado

2. **Compartilhe** 🎧
   - Divulgue suas músicas e alcance seu público

3. **Conecte-se** 🔥
   - Faça parte da comunidade do rap nacional

### Estatísticas
- 1000+ Artistas
- 5000+ Músicas
- 24/7 Disponível

### Botões de Ação
- **Começar Agora**: Abre modal de cadastro
- **Já tenho conta**: Abre modal de login

## 🎨 Animações

### Animações Principais
- **Fade In**: Elementos aparecem suavemente
- **Slide Up**: Elementos sobem com fade
- **Bounce**: Ícone musical pula continuamente
- **Float**: Notas musicais flutuam pela tela

### Delays de Animação
- Delay 1: 0.3s
- Delay 2: 0.6s
- Delay 3: 0.9s

### Notas Musicais Flutuantes
5 notas musicais (♪ ♫) animadas flutuando em diferentes posições e tempos

## 🎭 Modais

### Modal de Login
- Email
- Senha
- Link para cadastro
- Mensagens de erro

### Modal de Cadastro
- Nome de Usuário (mín. 3 caracteres)
- Email
- Senha (mín. 6 caracteres)
- Confirmar Senha
- Link para login
- Mensagens de erro e sucesso

## 🎨 Esquema de Cores

```css
--primary-color: #6366f1 (Azul)
--primary-hover: #4f46e5 (Azul escuro)
--secondary-color: #64748b (Cinza)
--background: #0f172a (Azul escuro)
--surface: #1e293b (Azul escuro médio)
--highlight: #fbbf24 (Dourado)
```

### Gradiente de Fundo
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📱 Responsividade

### Desktop (> 768px)
- Brand name: 4rem
- Features: Grid 3 colunas
- Botões: Lado a lado

### Tablet (≤ 768px)
- Brand name: 3rem
- Features: 1 coluna
- Botões: Empilhados

### Mobile (≤ 576px)
- Brand name: 2.5rem
- Ícone musical: 60px
- Layout otimizado

## 🎯 Interações

### Abertura de Modais
- Click em "Começar Agora" → Modal de cadastro
- Click em "Já tenho conta" → Modal de login
- Click fora do modal → Fecha modal
- Click no "×" → Fecha modal

### Alternância entre Modais
- Link "Cadastre-se" no login → Abre cadastro
- Link "Entrar" no cadastro → Abre login

### Validações
- ✅ Todos os campos obrigatórios
- ✅ Username mínimo 3 caracteres
- ✅ Senha mínima 6 caracteres
- ✅ Confirmação de senha
- ✅ Email válido

## 🚀 Como Usar

1. Abra `index.html` no navegador
2. Visualize a landing page com animações
3. Click em "Começar Agora" para cadastrar
4. Ou click em "Já tenho conta" para fazer login

## 🔧 Arquivos

- `index.html` - Estrutura HTML
- `css/style.css` - Estilos e animações
- `js/auth.js` - Lógica de autenticação e modais

## 🎬 Efeitos Visuais

- **Hover em Cards**: Elevação e aumento de brilho
- **Hover em Botões**: Elevação e sombra
- **Blur Effect**: Backdrop blur nos cards
- **Text Shadow**: Efeitos de sombra no texto
- **Box Shadow**: Sombras profundas nos elementos

## 📊 Performance

- Animações CSS otimizadas
- Uso de `transform` e `opacity` para melhor performance
- Backdrop filter para efeitos de vidro
- Lazy loading de elementos
