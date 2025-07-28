#!/usr/bin/env pwsh
# Скрипт для настройки прав доступа к проекту

Write-Host "Setting up project permissions..." -ForegroundColor Yellow

# Получаем текущую папку проекта
$projectPath = Get-Location

Write-Host "Project path: $projectPath" -ForegroundColor Cyan

try {
    # 1. Даём полные права текущему пользователю
    Write-Host "Setting user permissions..." -ForegroundColor Green
    icacls $projectPath /grant "${env:USERNAME}:(OI)(CI)F" /T /Q
    
    # 2. Снимаем атрибут "только чтение" со всех файлов
    Write-Host "Removing read-only attributes..." -ForegroundColor Green
    attrib -R "$projectPath\*.*" /S /D
    
    # 3. Особые права для папки assets/images
    $imagesPath = Join-Path $projectPath "assets\images"
    if (Test-Path $imagesPath) {
        Write-Host "Setting permissions for images folder..." -ForegroundColor Green
        icacls $imagesPath /grant "${env:USERNAME}:(OI)(CI)F" /T /Q
        icacls $imagesPath /grant "Everyone:(OI)(CI)M" /T /Q
    }
    
    # 4. Настройка прав для node_modules (если есть)
    $nodeModulesPath = Join-Path $projectPath "node_modules"
    if (Test-Path $nodeModulesPath) {
        Write-Host "Setting permissions for node_modules..." -ForegroundColor Green
        icacls $nodeModulesPath /grant "${env:USERNAME}:(OI)(CI)F" /T /Q
    }
    
    # 5. Отключение индексирования для ускорения работы
    Write-Host "Disabling indexing..." -ForegroundColor Green
    attrib +N "$projectPath" /S /D
    
    # 6. Настройка исключений Windows Defender
    Write-Host "🛡️ Попытка добавить в исключения Windows Defender..." -ForegroundColor Green
    try {
        Add-MpPreference -ExclusionPath $projectPath -ErrorAction SilentlyContinue
        Write-Host "✅ Папка добавлена в исключения Windows Defender" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Не удалось добавить в исключения Defender (нужны права администратора)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "PERMISSIONS SETUP COMPLETE!" -ForegroundColor Green
    Write-Host "Full permissions for user: $env:USERNAME" -ForegroundColor White
    Write-Host "Read-only attributes removed" -ForegroundColor White
    Write-Host "Special permissions for images folder" -ForegroundColor White
    Write-Host ""
    Write-Host "Now you can run: npm run dev" -ForegroundColor Cyan
    
}
catch {
    Write-Host ""
    Write-Host "ERROR setting permissions:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running PowerShell as Administrator:" -ForegroundColor Yellow
    Write-Host "Win + X -> Windows PowerShell (Administrator)" -ForegroundColor White
    Write-Host "cd '$projectPath'" -ForegroundColor White
    Write-Host "npm run setup-permissions" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 