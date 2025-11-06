# 🎯 Como Criar o Novo Repositório whatsapp-CoEx

## ✅ Passo a Passo

### 1️⃣ Criar o Repositório no GitHub

1. **Acesse**: https://github.com/new

2. **Preencha os dados**:
   ```
   Repository name: whatsapp-CoEx
   Description: WhatsApp Embedded Signup com CoEx - Aplicação completa para conectar números via API Cloud
   ```

3. **Configurações**:
   - ✅ **Public** (recomendado) ou **Private**
   - ❌ **NÃO marque** "Add a README file"
   - ❌ **NÃO marque** "Add .gitignore"
   - ❌ **NÃO marque** "Choose a license"

4. **Clique em**: "Create repository"

---

### 2️⃣ Executar o Script de Configuração

Após criar o repositório no GitHub, execute:

```powershell
# No terminal PowerShell, na pasta do projeto:
.\setup-new-repo.ps1
```

**O script vai:**
- ✅ Adicionar todos os arquivos
- ✅ Fazer commit das mudanças
- ✅ Remover o remote antigo
- ✅ Adicionar o novo remote (whatsapp-CoEx)
- ✅ Renomear branch para `main` (se necessário)
- ✅ Fazer push para o novo repositório

---

### 3️⃣ Alternativa Manual (Sem Script)

Se preferir fazer manualmente:

```powershell
# 1. Verificar status
git status

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer commit
git commit -m "feat: Configuração completa para Easypanel com callbacks do Facebook"

# 4. Remover remote antigo
git remote remove origin

# 5. Adicionar novo remote
git remote add origin https://github.com/BrunoGroehs/whatsapp-CoEx.git

# 6. Renomear branch para main (se estiver em master)
git branch -M main

# 7. Fazer push
git push -u origin main
```

---

### 4️⃣ Verificar se Funcionou

1. **Acesse o repositório**:
   ```
   https://github.com/BrunoGroehs/whatsapp-CoEx
   ```

2. **Verifique se os arquivos estão lá**:
   - ✅ `docker-compose.easypanel.yml`
   - ✅ `README.md`
   - ✅ `EASYPANEL_DEPLOY.md`
   - ✅ `backend/`, `frontend/`, `nginx/`
   - ✅ Documentação completa

---

### 5️⃣ Configurar Descrição e Tags (Opcional)

No GitHub, edite o repositório:

1. **About** (ao lado direito):
   - **Description**: `WhatsApp Embedded Signup com CoEx - Aplicação completa para conectar números via API Cloud`
   - **Website**: Seu domínio do Easypanel (depois do deploy)
   - **Topics**: `whatsapp`, `embedded-signup`, `coex`, `docker`, `easypanel`, `nodejs`, `facebook-api`

---

## 🚀 Próximos Passos

Após criar o repositório:

1. ✅ **Deploy no Easypanel**:
   - Conectar repositório `whatsapp-CoEx`
   - Seguir guia em `EASYPANEL_DEPLOY.md`

2. ✅ **Configurar Facebook App**:
   - Adicionar URLs de callback
   - Configurar webhook

3. ✅ **Testar**:
   - Usar comandos em `COMANDOS_TESTE.md`
   - Seguir checklist em `CHECKLIST_DEPLOY.md`

---

## 📝 Comandos Úteis

```powershell
# Ver repositório remoto configurado
git remote -v

# Ver commits recentes
git log --oneline -5

# Verificar branch atual
git branch --show-current

# Ver arquivos modificados
git status

# Fazer push de alterações futuras
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

---

## 🔐 Autenticação do GitHub

Se o Git solicitar credenciais:

### Opção 1: GitHub CLI (Recomendado)
```powershell
# Instalar GitHub CLI
winget install --id GitHub.cli

# Fazer login
gh auth login
```

### Opção 2: Personal Access Token
1. Acesse: https://github.com/settings/tokens
2. Gere um token com permissões `repo`
3. Use o token como senha quando solicitado

### Opção 3: SSH
```powershell
# Usar SSH ao invés de HTTPS
git remote set-url origin git@github.com:BrunoGroehs/whatsapp-CoEx.git
```

---

## ✅ Checklist

- [ ] Repositório criado no GitHub
- [ ] Script `setup-new-repo.ps1` executado (ou comandos manuais)
- [ ] Push realizado com sucesso
- [ ] Arquivos visíveis no GitHub
- [ ] Remote configurado corretamente (`git remote -v`)
- [ ] Pronto para configurar no Easypanel!

---

**Boa sorte com o novo repositório! 🎉**
