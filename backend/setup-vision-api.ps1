$ErrorActionPreference = "Stop"

Write-Host "`n🔐 Google Vision API Setup Wizard for LokSetu" -ForegroundColor Cyan
Write-Host "===============================================`n" -ForegroundColor Cyan

Write-Host "This wizard will help you set up Google Vision API for image verification.`n" -ForegroundColor White

Write-Host "📋 Prerequisite Checklist:" -ForegroundColor Yellow
Write-Host "  ☐ Google Account created? (Go to google.com if not)" -ForegroundColor White
Write-Host "  ☐ Google Cloud Account created? (Go to cloud.google.com/free)" -ForegroundColor White
Write-Host "  ☐ Vision API enabled in Google Cloud Console?" -ForegroundColor White
Write-Host "  ☐ API Credentials downloaded or API Key copied?" -ForegroundColor White
Write-Host ""

$proceed = Read-Host "Continue setup? (yes/no)"
if ($proceed -ne "yes") {
    Write-Host "Setup cancelled." -ForegroundColor Red
    exit 1
}

Write-Host "`n📝 Step 1: Enter Your Google Vision API Credentials" -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose your method:" -ForegroundColor White
Write-Host "  1) API Key (simpler, good for development)"
Write-Host "  2) Service Account JSON (better for production)"
Write-Host ""

$method = Read-Host "Select (1 or 2)"

$envFile = Join-Path $PSScriptRoot ".env"
$backendPath = Split-Path -Parent $PSScriptRoot

if ($method -eq "1") {
    Write-Host "`n🔑 API Key Method" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    $apiKey = Read-Host "Paste your Google Vision API Key"
    
    if ($apiKey.Length -lt 10) {
        Write-Host "❌ Invalid API Key (too short)" -ForegroundColor Red
        exit 1
    }
    
    # Check if .env exists
    if (Test-Path $envFile) {
        # Check if GOOGLE_VISION_API_KEY already exists
        $content = Get-Content $envFile -Raw
        if ($content -match "GOOGLE_VISION_API_KEY") {
            $content = $content -replace 'GOOGLE_VISION_API_KEY=.*', "GOOGLE_VISION_API_KEY=$apiKey"
            Set-Content $envFile $content
            Write-Host "✅ Updated existing GOOGLE_VISION_API_KEY in .env" -ForegroundColor Green
        } else {
            Add-Content $envFile "`nGOOGLE_VISION_API_KEY=$apiKey"
            Write-Host "✅ Added GOOGLE_VISION_API_KEY to .env" -ForegroundColor Green
        }
    } else {
        Set-Content $envFile "GOOGLE_VISION_API_KEY=$apiKey"
        Write-Host "✅ Created .env with GOOGLE_VISION_API_KEY" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "📁 Location: $envFile" -ForegroundColor White
    
} elseif ($method -eq "2") {
    Write-Host "`n🐻 Service Account JSON Method" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    $jsonPath = Read-Host "Paste full path to vision-credentials.json file"
    
    if (-not (Test-Path $jsonPath)) {
        Write-Host "❌ File not found: $jsonPath" -ForegroundColor Red
        exit 1
    }
    
    # Normalize path
    $jsonPath = Resolve-Path $jsonPath
    
    if (Test-Path $envFile) {
        $content = Get-Content $envFile -Raw
        if ($content -match "GOOGLE_APPLICATION_CREDENTIALS") {
            $content = $content -replace 'GOOGLE_APPLICATION_CREDENTIALS=.*', "GOOGLE_APPLICATION_CREDENTIALS=$jsonPath"
            Set-Content $envFile $content
            Write-Host "✅ Updated existing GOOGLE_APPLICATION_CREDENTIALS in .env" -ForegroundColor Green
        } else {
            Add-Content $envFile "`nGOOGLE_APPLICATION_CREDENTIALS=$jsonPath"
            Write-Host "✅ Added GOOGLE_APPLICATION_CREDENTIALS to .env" -ForegroundColor Green
        }
    } else {
        Set-Content $envFile "GOOGLE_APPLICATION_CREDENTIALS=$jsonPath"
        Write-Host "✅ Created .env with GOOGLE_APPLICATION_CREDENTIALS" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "📁 JSON Path: $jsonPath" -ForegroundColor White
    Write-Host "📁 .env File: $envFile" -ForegroundColor White
} else {
    Write-Host "❌ Invalid selection" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Restart your backend server:"
Write-Host "     npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Test the integration:"
Write-Host "     node test-vision.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Try uploading an image with the wrong category"
Write-Host "     The system should now show warnings for mismatches!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 For more details, see: GOOGLE_VISION_SETUP.md" -ForegroundColor White
Write-Host ""
