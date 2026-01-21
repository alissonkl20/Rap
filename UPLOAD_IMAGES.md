# Sistema de Upload de Imagens - MoveRap

## 📋 Resumo das Alterações

Foi implementado um sistema completo de upload de imagens para substituir as URLs externas.

## 🎯 Funcionalidades

### Frontend
- ✅ Inputs de arquivo para foto de perfil e imagem de fundo
- ✅ Preview das imagens antes do upload
- ✅ Validação de tamanho (máx. 5MB)
- ✅ Validação de formato (JPG, PNG, GIF, WEBP)
- ✅ Botões para remover imagens
- ✅ Feedback visual durante o upload
- ✅ Exibição de imagens já salvas

### Backend
- ✅ Endpoint de upload (`POST /api/upload/image`)
- ✅ Endpoint de exclusão (`DELETE /api/upload/image/{filename}`)
- ✅ Validações de segurança (tamanho, tipo, autenticação)
- ✅ Geração de nomes únicos (UUID)
- ✅ Configuração para servir arquivos estáticos
- ✅ Suporte a multipart/form-data

## 📁 Arquivos Criados

1. **FileUploadController.java** - Controller para upload/exclusão de imagens
2. **WebConfig.java** - Configuração para servir arquivos do diretório uploads
3. **uploads/** - Diretório para armazenar as imagens

## 📝 Arquivos Modificados

### Backend
- `application.yaml` - Configuração de multipart e diretório de upload
- `SecurityConfig.java` - Permissões para rotas de upload e acesso público às imagens

### Frontend
- `dashboard.html` - Substituição de inputs URL por inputs de arquivo
- `dashboard.css` - Estilos para preview e botões de remoção
- `dashboard.js` - Lógica de upload, preview e validação

## 🔧 Configurações

### application.yaml
```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: 5MB
      max-request-size: 10MB

file:
  upload-dir: uploads
```

## 🚀 Como Usar

1. **Fazer Upload:**
   - Vá para "Editar Página"
   - Clique em "Escolher arquivo" em Foto de Perfil ou Imagem de Fundo
   - Selecione uma imagem (JPG, PNG, GIF ou WEBP, máx. 5MB)
   - Visualize o preview
   - Clique em "Salvar Página"

2. **Remover Imagem:**
   - Clique no botão "×" no canto do preview
   - A imagem será removida da seleção

3. **Imagens já salvas:**
   - Aparecem automaticamente no preview ao editar
   - Podem ser substituídas selecionando uma nova imagem

## 🔒 Segurança

- ✅ Autenticação obrigatória para upload
- ✅ Validação de tipo de arquivo
- ✅ Limite de tamanho (5MB)
- ✅ Nomes de arquivo únicos (UUID)
- ✅ Acesso público apenas para leitura (/uploads/**)

## 📂 Estrutura de Diretórios

```
Rap/
├── uploads/              # Imagens enviadas pelos usuários
│   └── .gitkeep
├── src/
│   └── main/
│       ├── java/
│       │   └── com/MoveRap/demo/
│       │       ├── config/
│       │       │   ├── SecurityConfig.java
│       │       │   └── WebConfig.java      ← NOVO
│       │       └── controller/
│       │           └── FileUploadController.java  ← NOVO
│       └── resources/
│           └── application.yaml
└── frontend/
    ├── dashboard.html
    ├── css/
    │   └── dashboard.css
    └── js/
        └── dashboard.js
```

## 🎨 Preview de Imagens

As imagens agora mostram um preview antes e após o upload:

- **Antes do upload:** Preview da imagem selecionada do computador
- **Após salvar:** Imagem carregada do servidor
- **Botão de remoção:** Permite remover/substituir a imagem

## ⚠️ Importante

- As imagens são salvas no diretório `uploads/` na raiz do projeto
- Este diretório está no `.gitignore` (exceto o `.gitkeep`)
- Em produção, considere usar um serviço de storage (AWS S3, Azure Blob, etc.)
- Reinicie a aplicação Spring Boot para aplicar as mudanças

## 🔄 Próximos Passos Opcionais

- [ ] Redimensionar imagens automaticamente
- [ ] Comprimir imagens para otimização
- [ ] Migrar para cloud storage (S3, Azure Blob)
- [ ] Adicionar edição/crop de imagens no frontend
- [ ] Implementar limpeza automática de imagens não utilizadas
