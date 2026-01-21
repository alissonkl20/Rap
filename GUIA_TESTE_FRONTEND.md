# 🚀 Guia de Teste - MoveRap Frontend

## Passo a Passo para Testar a Aplicação

### 1. Iniciar o Backend
```bash
# No terminal docker (ou qualquer terminal na pasta do projeto)
docker-compose up
```

Aguarde até ver a mensagem: `Started MoveRapApplication`

### 2. Acessar a Aplicação
Abra seu navegador e acesse:
```
http://localhost:8080
```

### 3. Testar Cadastro de Usuário

1. Clique no botão **"Cadastrar"** no canto superior direito
2. Preencha o formulário:
   - **Nome de usuário**: `teste123`
   - **Email**: `teste@teste.com`
   - **Senha**: `123456`
   - **Confirmar senha**: `123456`
3. Clique em **"Criar Conta"**

**Resultado Esperado:**
- ✅ Mensagem de sucesso
- ✅ Login automático
- ✅ Redirecionamento para `/user-page.html`

### 4. Testar Edição da Página do Usuário

Na página do usuário, você verá dois painéis:
- **Esquerda**: Preview ao vivo
- **Direita**: Formulário de edição

#### Testar Biografia
1. Digite uma biografia no campo **"Biografia"**
2. Veja a atualização em tempo real no preview

#### Testar Imagem de Perfil
1. Cole uma URL de imagem (exemplo):
   ```
   https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=MC+Teste
   ```
2. Clique em **"Testar"**
3. Clique em **"Usar Esta Imagem"**
4. Veja a imagem atualizada no preview

#### Testar Imagem de Fundo
1. Cole uma URL de imagem (exemplo):
   ```
   https://via.placeholder.com/1920x400/4ECDC4/FFFFFF?text=Background
   ```
2. Clique em **"Testar"**
3. Clique em **"Usar Esta Imagem"**

#### Testar Links de Músicas
1. Cole links de músicas, um por linha (exemplos):
   ```
   https://open.spotify.com/track/exemplo1
   https://www.youtube.com/watch?v=exemplo2
   https://soundcloud.com/exemplo3
   ```
2. Veja os cards de música aparecerem no preview

### 5. Salvar Alterações

1. Clique no botão **"Salvar Alterações"**
2. Aguarde a mensagem de sucesso

**Resultado Esperado:**
- ✅ Mensagem: "Página salva com sucesso!"
- ✅ Botão volta ao estado normal

### 6. Verificar Persistência dos Dados

1. Recarregue a página (F5)
2. Faça login novamente se necessário

**Resultado Esperado:**
- ✅ Todos os dados salvos aparecem nos campos
- ✅ O preview mostra os dados salvos

### 7. Testar Logout

1. Clique no botão de logout (ícone de saída no rodapé lateral)
2. Confirme a ação

**Resultado Esperado:**
- ✅ Redirecionamento para página inicial
- ✅ Sessão encerrada

## 🔍 Onde Verificar Problemas

### Console do Navegador
Pressione `F12` e vá para a aba **Console**

**Mensagens Esperadas:**
- `Initializing Move Rap App...`
- `App initialized successfully`
- `Making request to: http://localhost:8080/...`

**Erros Comuns:**
- ❌ `CORS error` → Verifique SecurityConfig.java
- ❌ `401 Unauthorized` → Sessão expirada, faça login novamente
- ❌ `Network error` → Backend não está rodando

### Network Tab (Rede)
Pressione `F12` e vá para a aba **Network** (Rede)

**Verificar Requisições:**
- `POST /auth/register` → Status 201
- `POST /auth/login` → Status 200
- `PUT /user-page/update` → Status 200
- `GET /user-page/me` → Status 200

### Logs do Backend
No terminal onde o Docker está rodando:

**Logs Esperados:**
```
Hibernate: insert into user_model ...
Hibernate: update user_page ...
```

**Erros Comuns:**
- ❌ `ConstraintViolationException` → Dados inválidos
- ❌ `UsernameNotFoundException` → Usuário não existe
- ❌ `DataIntegrityViolationException` → Email/username duplicado

## 📊 Checklist Completo

- [ ] Backend iniciado com sucesso
- [ ] Página inicial carrega em http://localhost:8080
- [ ] Cadastro de usuário funciona
- [ ] Login funciona
- [ ] Redirecionamento para user-page após login
- [ ] Preview atualiza em tempo real
- [ ] Teste de imagens funciona
- [ ] Salvar página funciona
- [ ] Dados persistem após reload
- [ ] Logout funciona

## 🎯 URLs de Teste para Imagens

### Imagens de Perfil (quadradas):
```
https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=MC+Teste
https://via.placeholder.com/300x300/95E1D3/FFFFFF?text=Rapper
https://via.placeholder.com/300x300/F38181/FFFFFF?text=Artist
```

### Imagens de Fundo (panorâmicas):
```
https://via.placeholder.com/1920x400/4ECDC4/FFFFFF?text=Background+Hip+Hop
https://via.placeholder.com/1920x400/293462/FFFFFF?text=Stage
https://via.placeholder.com/1920x400/AA96DA/FFFFFF?text=Music
```

### Links de Músicas (exemplos fictícios):
```
https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://soundcloud.com/artist/track-name
https://music.apple.com/us/album/track/123456789
```

## 💡 Dicas

1. **Sempre use URLs completas** (começando com `http://` ou `https://`)
2. **Imagens de perfil** funcionam melhor em formato quadrado
3. **Imagens de fundo** funcionam melhor em formato panorâmico (16:9)
4. **Biografia** tem limite de 500 caracteres
5. **Links de músicas** podem ser de qualquer plataforma

## 🆘 Ajuda Rápida

### Cadastro não funciona?
- Verifique se email é válido
- Senha deve ter no mínimo 6 caracteres
- Username deve ter entre 3-50 caracteres

### Login não funciona?
- Verifique email e senha
- Backend deve estar rodando
- Tente fazer cadastro novamente

### Imagens não carregam?
- Verifique se a URL é válida
- Teste a URL diretamente no navegador
- Use URLs de imagens públicas (não privadas)

### Dados não salvam?
- Verifique console do navegador
- Verifique logs do backend
- Certifique-se de estar autenticado
