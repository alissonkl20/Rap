# 🚀 Deploy para Produção - 100% Gratuito

## Opção 1: Render.com (Recomendado - Mais Fácil)

### ✅ Vantagens
- 750 horas/mês grátis
- PostgreSQL gratuito
- Deploy automático via GitHub
- Suporte nativo a Docker
- SSL gratuito

### 📋 Passo a Passo

1. **Criar conta no Render**
   - Acesse: https://render.com
   - Faça login com GitHub

2. **Fazer push do código para GitHub**
   ```bash
   git init
   git add .
   git commit -m "Deploy inicial"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/moverap.git
   git push -u origin main
   ```

3. **Criar PostgreSQL Database**
   - No dashboard Render, clique em "New +"
   - Selecione "PostgreSQL"
   - Nome: `moverap-db`
   - Database: `rapnat`
   - User: `rapnat_user`
   - Region: Oregon (mais próximo)
   - Clique em "Create Database"
   - **IMPORTANTE**: Copie a Internal Database URL

4. **Criar Web Service**
   - Clique em "New +" > "Web Service"
   - Conecte seu repositório GitHub
   - Nome: `moverap-api`
   - Environment: `Docker`
   - Region: Oregon
   - Instance Type: `Free`
   - Clique em "Advanced" e adicione variáveis de ambiente:
     - `SPRING_DATASOURCE_URL`: Cole a Internal Database URL
     - `SPRING_DATASOURCE_USERNAME`: rapnat_user
     - `SPRING_DATASOURCE_PASSWORD`: (senha do banco)
     - `SPRING_PROFILES_ACTIVE`: prod
   - Clique em "Create Web Service"

5. **Aguardar o Deploy**
   - O Render vai buildar sua imagem Docker
   - Em ~5-10 minutos estará online
   - URL: `https://moverap-api.onrender.com`

### ⚠️ Limitações do Free Tier
- Sleep após 15 minutos de inatividade
- Primeiro acesso pode demorar ~30s (cold start)
- PostgreSQL gratuito por 90 dias (depois pode migrar dados)

---

## Opção 2: Railway.app (Melhor Performance)

### ✅ Vantagens
- $5 de crédito grátis/mês
- Sem sleep automático
- PostgreSQL incluído
- Deploy mais rápido

### 📋 Passo a Passo

1. **Criar conta**
   - Acesse: https://railway.app
   - Login com GitHub

2. **Criar novo projeto**
   - "New Project" > "Deploy from GitHub repo"
   - Selecione seu repositório

3. **Adicionar PostgreSQL**
   - No projeto, clique em "+ New"
   - Selecione "Database" > "PostgreSQL"

4. **Configurar variáveis**
   - Clique no serviço da aplicação
   - Aba "Variables"
   - Adicione:
     - `SPRING_DATASOURCE_URL`: ${{Postgres.DATABASE_URL}}
     - `SPRING_DATASOURCE_USERNAME`: ${{Postgres.PGUSER}}
     - `SPRING_DATASOURCE_PASSWORD`: ${{Postgres.PGPASSWORD}}

5. **Deploy automático**
   - Railway detecta o Dockerfile automaticamente
   - Deploy acontece em ~3-5 minutos

---

## Opção 3: Fly.io (Mais Profissional)

### ✅ Vantagens
- Sem sleep automático
- 3 VMs gratuitas
- PostgreSQL 3GB grátis
- Melhor para produção

### 📋 Passo a Passo

1. **Instalar Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Criar arquivo fly.toml** (já está no projeto)

4. **Criar PostgreSQL**
   ```bash
   fly postgres create --name moverap-db --region gru
   ```

5. **Deploy da aplicação**
   ```bash
   fly launch --name moverap-api --region gru
   fly deploy
   ```

6. **Conectar ao banco**
   ```bash
   fly postgres attach --app moverap-api moverap-db
   ```

---

## Opção 4: Oracle Cloud Always Free (Mais Robusto)

### ✅ Vantagens
- **SEMPRE GRATUITO** (não expira)
- 2 VMs Ampere A1
- PostgreSQL sem limites
- 200GB storage

### ⚠️ Desvantagens
- Configuração mais complexa
- Requer cartão de crédito (não cobra)
- Setup manual com Docker Compose

### 📋 Configuração Básica

1. Criar conta: https://cloud.oracle.com
2. Criar VM Ubuntu com Always Free
3. Instalar Docker e Docker Compose
4. Fazer upload do projeto via SSH
5. Rodar `docker-compose up -d`

---

## 📊 Comparativo Rápido

| Plataforma | Setup | Performance | Limitação | Melhor Para |
|------------|-------|-------------|-----------|-------------|
| **Render** | ⭐⭐⭐ Fácil | ⭐⭐ Média | Sleep 15min | Iniciantes |
| **Railway** | ⭐⭐⭐ Fácil | ⭐⭐⭐ Boa | $5/mês | Apps pequenos |
| **Fly.io** | ⭐⭐ Médio | ⭐⭐⭐ Ótima | 3 VMs | Produção real |
| **Oracle** | ⭐ Difícil | ⭐⭐⭐⭐ Excelente | Setup complexo | Long-term |

---

## 🎯 Recomendação Final

**Para começar rápido**: Use **Render.com**
- Mais fácil de configurar
- Deploy em 10 minutos
- Perfeito para MVP/testes

**Para produção séria**: Use **Fly.io**
- Sem sleep
- Melhor performance
- Escalável

**Para nunca pagar**: Use **Oracle Cloud**
- Always Free para sempre
- Mais trabalho inicial
- Infraestrutura robusta

---

## 🔧 Próximos Passos

1. Escolha uma plataforma acima
2. Siga o passo a passo correspondente
3. Faça push do código para GitHub (se necessário)
4. Configure as variáveis de ambiente
5. Aguarde o deploy

Sua aplicação estará online em poucos minutos! 🎉
