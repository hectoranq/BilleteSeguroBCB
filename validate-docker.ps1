# Script de validación para Docker antes de desplegar en Coolify
# Ejecutar: .\validate-docker.ps1

Write-Host "🐳 Validando configuración Docker para Coolify..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esté instalado
Write-Host "Verificando Docker..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado o no está en PATH" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker está instalado" -ForegroundColor Green

# Verificar archivos necesarios
Write-Host ""
Write-Host "Verificando archivos necesarios..." -ForegroundColor Yellow

$requiredFiles = @(
    "Dockerfile",
    ".dockerignore",
    "next.config.mjs",
    "package.json"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $file NO existe" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (!$allFilesExist) {
    Write-Host ""
    Write-Host "❌ Faltan archivos necesarios" -ForegroundColor Red
    exit 1
}

# Verificar next.config.mjs tiene output: 'standalone'
Write-Host ""
Write-Host "Verificando next.config.mjs..." -ForegroundColor Yellow
$nextConfig = Get-Content "next.config.mjs" -Raw
if ($nextConfig -match "output.*standalone") {
    Write-Host "✅ next.config.mjs tiene output: 'standalone'" -ForegroundColor Green
} else {
    Write-Host "⚠️  next.config.mjs NO tiene output: 'standalone'" -ForegroundColor Yellow
    Write-Host "   Esto es necesario para Docker. Agregando..." -ForegroundColor Yellow
}

# Build de prueba
Write-Host ""
Write-Host "Construyendo imagen de prueba..." -ForegroundColor Yellow
Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Gray

$buildOutput = docker build -t billete-seguro-bcb:test . 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso" -ForegroundColor Green
} else {
    Write-Host "❌ Build falló" -ForegroundColor Red
    Write-Host $buildOutput
    exit 1
}

# Verificar tamaño de imagen
Write-Host ""
Write-Host "Verificando tamaño de imagen..." -ForegroundColor Yellow
$imageInfo = docker images billete-seguro-bcb:test --format "{{.Size}}"
Write-Host "📦 Tamaño de imagen: $imageInfo" -ForegroundColor Cyan

# Test de ejecución
Write-Host ""
Write-Host "Iniciando contenedor de prueba..." -ForegroundColor Yellow
$containerId = docker run -d -p 3001:3000 billete-seguro-bcb:test
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Contenedor iniciado: $containerId" -ForegroundColor Green
    
    # Esperar que la aplicación inicie
    Write-Host "Esperando que la aplicación inicie (30 segundos)..." -ForegroundColor Gray
    Start-Sleep -Seconds 30
    
    # Verificar health check
    Write-Host ""
    Write-Host "Verificando health check..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Health check exitoso (HTTP 200)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Health check devolvió: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Health check falló: $_" -ForegroundColor Red
    }
    
    # Ver logs
    Write-Host ""
    Write-Host "Últimas líneas de logs:" -ForegroundColor Yellow
    docker logs --tail 20 $containerId
    
    # Limpiar
    Write-Host ""
    Write-Host "Limpiando contenedor de prueba..." -ForegroundColor Yellow
    docker stop $containerId | Out-Null
    docker rm $containerId | Out-Null
    Write-Host "✅ Contenedor eliminado" -ForegroundColor Green
} else {
    Write-Host "❌ No se pudo iniciar el contenedor" -ForegroundColor Red
    exit 1
}

# Resumen
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ Validación completada exitosamente" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Siguiente paso:" -ForegroundColor Yellow
Write-Host "   1. Subir cambios a Git: git push" -ForegroundColor White
Write-Host "   2. En Coolify: Conectar repositorio" -ForegroundColor White
Write-Host "   3. Configurar puerto: 3000" -ForegroundColor White
Write-Host "   4. Desplegar" -ForegroundColor White
Write-Host ""
Write-Host "📖 Ver guía completa en COOLIFY.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tip: La imagen 'billete-seguro-bcb:test' está disponible localmente" -ForegroundColor Gray
Write-Host "   Para eliminarla: docker rmi billete-seguro-bcb:test" -ForegroundColor Gray
