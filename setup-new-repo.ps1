# Script para configurar novo repositório whatsapp-CoEx
# Execute este script DEPOIS de criar o repositório no GitHub

Write-Host "🚀 Configurando novo repositório whatsapp-CoEx..." -ForegroundColor Green
Write-Host ""

# 1. Verificar se estamos no diretório correto
if (!(Test-Path "docker-compose.easypanel.yml")) {
    Write-Host "❌ ERRO: Execute este script na raiz do projeto whatsapp-coex-app" -ForegroundColor Red
    exit 1
}

# 2. Verificar status do git
Write-Host "📊 Status atual do Git:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "⚠️  ATENÇÃO: Você já criou o repositório 'whatsapp-CoEx' no GitHub?" -ForegroundColor Yellow
Write-Host "   Se não, acesse: https://github.com/new e crie agora." -ForegroundColor Yellow
Write-Host ""
$continue = Read-Host "Pressione ENTER para continuar ou CTRL+C para cancelar"

# 3. Adicionar todos os arquivos
Write-Host ""
Write-Host "📝 Adicionando arquivos..." -ForegroundColor Cyan
git add .

# 4. Verificar se há algo para commitar
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Fazendo commit das mudanças..." -ForegroundColor Cyan
    git commit -m "feat: Configuração completa para Easypanel com suporte a callbacks do Facebook

- Adicionado endpoint /callback para OAuth redirect
- Configurado NGINX para rotear callbacks corretamente
- Frontend com configuração dinâmica (funciona em qualquer domínio)
- Documentação completa de deploy no Easypanel
- Guias de teste e troubleshooting
- Suporte completo a WhatsApp Embedded Signup com CoEx"
} else {
    Write-Host "ℹ️  Nenhuma mudança para commitar" -ForegroundColor Yellow
}

# 5. Adicionar novo remote
Write-Host ""
Write-Host "🔗 Configurando novo repositório remoto..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/BrunoGroehs/whatsapp-CoEx.git

# 6. Verificar remote
Write-Host ""
Write-Host "✅ Repositório remoto configurado:" -ForegroundColor Green
git remote -v

# 7. Fazer push
Write-Host ""
Write-Host "🚀 Fazendo push para o novo repositório..." -ForegroundColor Cyan
Write-Host "   (Isso pode solicitar suas credenciais do GitHub)" -ForegroundColor Yellow
Write-Host ""

# Verificar se branch é main ou master
$currentBranch = git branch --show-current
if ($currentBranch -eq "master") {
    Write-Host "ℹ️  Branch atual: master (renomeando para main...)" -ForegroundColor Yellow
    git branch -M main
    git push -u origin main
} else {
    git push -u origin $currentBranch
}

Write-Host ""
Write-Host "🎉 SUCESSO! Repositório configurado!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Seu novo repositório está em:" -ForegroundColor Cyan
Write-Host "   https://github.com/BrunoGroehs/whatsapp-CoEx" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Acesse o repositório no GitHub" -ForegroundColor White
Write-Host "   2. Configure o Easypanel para usar este repositório" -ForegroundColor White
Write-Host "   3. Siga o guia em EASYPANEL_DEPLOY.md" -ForegroundColor White
Write-Host ""
