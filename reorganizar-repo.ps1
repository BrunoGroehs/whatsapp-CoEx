# Script para reorganizar repositório - Arquivos na raiz
# Remove a estrutura de pastas Facebook/whatsapp-coex-app

Write-Host "🔄 Reorganizando repositório..." -ForegroundColor Green
Write-Host ""

# 1. Voltar para pasta raiz temporária
$tempDir = "C:\Users\I753372\Desktop\TEMP-whatsapp-coex"
$currentDir = Get-Location

Write-Host "📁 Criando diretório temporário..." -ForegroundColor Cyan
if (Test-Path $tempDir) {
    Remove-Item -Path $tempDir -Recurse -Force
}
New-Item -Path $tempDir -ItemType Directory | Out-Null

# 2. Copiar todos os arquivos para o temp
Write-Host "📋 Copiando arquivos..." -ForegroundColor Cyan
Copy-Item -Path "$currentDir\*" -Destination $tempDir -Recurse -Force

# 3. Voltar para raiz e limpar
Set-Location "C:\Users\I753372\Desktop\VIBE-CODING"
Write-Host "🧹 Limpando repositório antigo..." -ForegroundColor Cyan
Remove-Item -Path "Facebook" -Recurse -Force -ErrorAction SilentlyContinue

# 4. Criar nova estrutura na raiz
Write-Host "📦 Criando nova estrutura..." -ForegroundColor Cyan
if (Test-Path ".git") {
    Remove-Item -Path ".git" -Recurse -Force
}

# 5. Copiar arquivos do temp para raiz
Write-Host "📥 Movendo arquivos para raiz..." -ForegroundColor Cyan
Copy-Item -Path "$tempDir\*" -Destination "." -Recurse -Force

# 6. Inicializar git
Write-Host "🔧 Inicializando Git..." -ForegroundColor Cyan
git init
git add .
git commit -m "feat: Reorganização - arquivos na raiz do repositório

- Removida estrutura de pastas Facebook/whatsapp-coex-app
- Todos os arquivos agora estão na raiz
- Facilita deploy no Easypanel
- Estrutura mais limpa e organizada"

# 7. Adicionar remote
Write-Host "🔗 Configurando remote..." -ForegroundColor Cyan
git remote add origin https://github.com/BrunoGroehs/whatsapp-CoEx.git

# 8. Force push (sobrescrever histórico)
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Isso vai sobrescrever o histórico do repositório!" -ForegroundColor Yellow
Write-Host "   Tem certeza? (S/N)" -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -eq "S" -or $confirm -eq "s") {
    Write-Host ""
    Write-Host "🚀 Fazendo push..." -ForegroundColor Cyan
    git branch -M main
    git push -f origin main
    
    Write-Host ""
    Write-Host "✅ SUCESSO! Repositório reorganizado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Estrutura agora:" -ForegroundColor Cyan
    Write-Host "   whatsapp-CoEx/" -ForegroundColor White
    Write-Host "   ├── backend/" -ForegroundColor White
    Write-Host "   ├── frontend/" -ForegroundColor White
    Write-Host "   ├── nginx/" -ForegroundColor White
    Write-Host "   ├── docker-compose.easypanel.yml" -ForegroundColor White
    Write-Host "   ├── README.md" -ForegroundColor White
    Write-Host "   └── ..." -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Operação cancelada" -ForegroundColor Red
}

# 9. Limpar temp
Write-Host ""
Write-Host "🧹 Limpando arquivos temporários..." -ForegroundColor Cyan
Remove-Item -Path $tempDir -Recurse -Force

Write-Host ""
Write-Host "✅ Concluído!" -ForegroundColor Green
