# Dollar City App Startup Script
# Run this with: .\start-app.ps1

Write-Host "`n🏪 DOLLAR CITY - Starting Application...`n" -ForegroundColor Cyan

# Step 1: Check Docker
Write-Host "1️⃣  Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Docker is not running!`n" -ForegroundColor Red
    Write-Host "   📌 ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "   • Open Docker Desktop from your Start Menu"
    Write-Host "   • Wait for it to say 'Docker Desktop is running'"
    Write-Host "   • Then run this script again`n"
    Write-Host "   Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Write-Host "   ✅ Docker is running`n" -ForegroundColor Green

# Step 2: Start Database
Write-Host "2️⃣  Starting PostgreSQL database..." -ForegroundColor Yellow
docker-compose up -d postgres
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ Failed to start database`n" -ForegroundColor Red
    exit 1
}
Write-Host "   ⏳ Waiting for database to initialize (15 seconds)..." -ForegroundColor Cyan
Start-Sleep -Seconds 15
Write-Host "   ✅ Database is running`n" -ForegroundColor Green

# Step 3: Check if jobs exist in database
Write-Host "3️⃣  Checking database..." -ForegroundColor Yellow
Set-Location "apps\api"
$jobCount = npx prisma db execute --stdin --schema=./prisma/schema.prisma --sql "SELECT COUNT(*) FROM jobs;" 2>$null
Set-Location "..\..\"

if ($jobCount -match "0") {
    Write-Host "   ⚠️  No jobs found in database!`n" -ForegroundColor Yellow
    Write-Host "   🔄 Importing Dollar City jobs..." -ForegroundColor Cyan
    node scripts/seed/import-data.js
    Write-Host "   ✅ Jobs imported`n" -ForegroundColor Green
} else {
    Write-Host "   ✅ Database has jobs`n" -ForegroundColor Green
}

# Step 4: Start API Server
Write-Host "4️⃣  Starting API server (port 4000)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'apps\api' ; Write-Host '🔌 API Server Running' -ForegroundColor Blue ; pnpm dev" -WindowStyle Normal
Write-Host "   ✅ API server started`n" -ForegroundColor Green

# Step 5: Start Web App
Write-Host "5️⃣  Starting web app (port 3001)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'apps\web' ; Write-Host '🌐 Web App Running' -ForegroundColor Green ; pnpm dev -p 3001" -WindowStyle Normal
Write-Host "   ✅ Web app started`n" -ForegroundColor Green

# Step 6: Wait for everything to initialize
Write-Host "6️⃣  Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Step 7: Done!
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green
Write-Host "✅ DOLLAR CITY APP IS READY!`n" -ForegroundColor Green -BackgroundColor Black
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green

Write-Host "🌐 Open your browser:" -ForegroundColor Cyan
Write-Host "   👉 http://localhost:3001`n" -ForegroundColor White

Write-Host "🔌 Services running:" -ForegroundColor Cyan
Write-Host "   • Web App:  http://localhost:3001" -ForegroundColor Green
Write-Host "   • API:      http://localhost:4000" -ForegroundColor Blue
Write-Host "   • Database: localhost:5433`n" -ForegroundColor Magenta

Write-Host "💡 To stop the app:" -ForegroundColor Yellow
Write-Host "   • Close the API and Web terminal windows"
Write-Host "   • Run: docker-compose down`n"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Green

# Open browser
Write-Host "🚀 Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Start-Process "http://localhost:3001"

Write-Host "`nPress any key to exit this window (services will keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

