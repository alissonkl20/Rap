# 🚀 Guia Rápido - Autenticação no Frontend

## Como usar autenticação nas suas requisições

### ✅ Opção 1: Usar o Helper api.js (RECOMENDADO)

O arquivo `api.js` foi criado para facilitar todas as requisições autenticadas. **Sempre use ele!**

#### Importar no HTML:
```html
<!-- Adicione ANTES dos outros scripts -->
<script src="js/api.js"></script>
<script src="js/seu-script.js"></script>
```

#### Exemplos de Uso:

**GET - Buscar dados:**
```javascript
try {
    const userData = await apiGet('/user-page/me');
    console.log('Dados do usuário:', userData);
} catch (error) {
    console.error('Erro:', error);
}
```

**POST - Criar algo:**
```javascript
try {
    const response = await apiPost('/user-page/create', {
        biography: 'Minha biografia',
        musicUrls: 'https://youtube.com/...'
    });
    
    if (response.ok) {
        const data = await response.json();
        console.log('Criado com sucesso!', data);
    }
} catch (error) {
    console.error('Erro:', error);
}
```

**PUT - Atualizar algo:**
```javascript
try {
    const response = await apiPut('/user-page/update', {
        biography: 'Nova biografia'
    });
    
    if (response.ok) {
        console.log('Atualizado com sucesso!');
    }
} catch (error) {
    console.error('Erro:', error);
}
```

**DELETE - Deletar algo:**
```javascript
try {
    const response = await apiDelete('/user-page/delete');
    
    if (response.ok) {
        console.log('Deletado com sucesso!');
    }
} catch (error) {
    console.error('Erro:', error);
}
```

**UPLOAD - Enviar arquivo:**
```javascript
const fileInput = document.getElementById('myFile');
const file = fileInput.files[0];

try {
    const result = await apiUpload('/api/upload/image', file, {
        type: 'profile'  // dados adicionais
    });
    
    console.log('Upload concluído:', result.url);
} catch (error) {
    console.error('Erro no upload:', error);
}
```

---

### ⚙️ Opção 2: Fazer Manualmente

Se preferir não usar o helper, faça assim:

```javascript
const authCredentials = localStorage.getItem('authCredentials');

if (!authCredentials) {
    alert('Você precisa fazer login!');
    window.location.href = 'index.html';
    return;
}

const response = await fetch('http://localhost:8080/user-page/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authCredentials}`  // ⚠️ OBRIGATÓRIO
    },
    credentials: 'include',  // ⚠️ OBRIGATÓRIO
    body: JSON.stringify({
        biography: 'Minha bio'
    })
});

if (response.ok) {
    const data = await response.json();
    console.log('Sucesso!', data);
} else if (response.status === 401) {
    alert('Sessão expirada. Faça login novamente.');
    localStorage.removeItem('user');
    localStorage.removeItem('authCredentials');
    window.location.href = 'index.html';
} else {
    const error = await response.json();
    console.error('Erro:', error.message);
}
```

---

## 🔐 Verificar se usuário está logado

```javascript
// Verificação simples
if (!localStorage.getItem('user') || !localStorage.getItem('authCredentials')) {
    window.location.href = 'index.html';
}

// Ou usando o helper
if (!isAuthenticated()) {
    window.location.href = 'index.html';
}
```

---

## 🚪 Fazer Logout

```javascript
function logout() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('authCredentials');
        window.location.href = 'index.html';
    }
}
```

---

## ❌ Erros Comuns e Soluções

### Erro: "401 Unauthorized"
**Causa:** Credenciais não foram enviadas ou são inválidas

**Solução:**
```javascript
// 1. Verifique se está logado
console.log('User:', localStorage.getItem('user'));
console.log('Auth:', localStorage.getItem('authCredentials'));

// 2. Se não aparecer, faça login novamente
```

### Erro: "CORS policy"
**Causa:** Origem não permitida no backend

**Solução:** Adicione sua origem em `SecurityConfig.java`:
```java
configuration.addAllowedOrigin("http://127.0.0.1:5500");
```

### Erro: "fetch is not defined"
**Causa:** Você está usando Node.js ou ambiente sem fetch

**Solução:** Use no navegador ou instale node-fetch

---

## 📋 Checklist para Requisições Autenticadas

Antes de fazer POST/PUT/DELETE, verifique:

- [ ] Usuário está logado?
- [ ] `authCredentials` existe no localStorage?
- [ ] Header `Authorization` está sendo enviado?
- [ ] `credentials: 'include'` está configurado?
- [ ] Importei o `api.js` no HTML?
- [ ] Backend está rodando?

---

## 🎯 Template Completo

Use este template para criar novas páginas:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Página</title>
</head>
<body>
    <h1>Minha Página</h1>
    <button id="btnSalvar">Salvar</button>
    
    <!-- API Helper PRIMEIRO -->
    <script src="js/api.js"></script>
    
    <script>
        // Verificar autenticação
        if (!isAuthenticated()) {
            window.location.href = 'index.html';
        }
        
        // Seu código
        document.getElementById('btnSalvar').addEventListener('click', async () => {
            try {
                const response = await apiPost('/user-page/create', {
                    biography: 'Teste'
                });
                
                if (response.ok) {
                    alert('Salvo com sucesso!');
                } else {
                    const error = await response.json();
                    alert('Erro: ' + error.message);
                }
            } catch (error) {
                alert('Erro ao conectar: ' + error.message);
            }
        });
    </script>
</body>
</html>
```

---

## 📞 Precisa de Ajuda?

1. **Erros no console:** Abra o DevTools (F12) → Console
2. **Erros de rede:** DevTools → Network → veja a requisição que falhou
3. **Testar autenticação:** Abra o Console e digite:
   ```javascript
   console.log(localStorage.getItem('authCredentials'));
   ```

---

**Lembre-se:** Sempre use HTTPS em produção! HTTP Basic só é seguro com HTTPS.
