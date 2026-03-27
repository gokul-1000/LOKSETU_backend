#!/bin/bash

# Google Vision API Setup Script
# This script helps you set up Google Vision API credentials for LokSetu

echo "🔐 Google Vision API Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if GOOGLE_APPLICATION_CREDENTIALS is already set
if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    echo "📝 Method 1: Using Service Account JSON File"
    echo "    1. Go to Google Cloud Console: https://console.cloud.google.com"
    echo "    2. Create a new project or select existing"
    echo "    3. Enable Vision API"
    echo "    4. Create a service account"
    echo "    5. Download the JSON key file"
    echo "    6. Set environment variable:"
    echo ""
    echo "    Windows (PowerShell):"
    echo "    \$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\credentials.json'"
    echo ""
    echo "    Linux/macOS:"
    echo "    export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📝 Method 2: Using API Key (Simpler for testing)"
    echo "    1. Go to Google Cloud Console"
    echo "    2. Create API Key in Credentials section"
    echo "    3. Add to .env file:"
    echo "    GOOGLE_VISION_API_KEY=your_api_key_here"
    echo ""
else
    echo "✅ GOOGLE_APPLICATION_CREDENTIALS is set:"
    echo "   $GOOGLE_APPLICATION_CREDENTIALS"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 For more help, see:"
echo "   https://cloud.google.com/vision/docs/setup"
echo ""
echo "🚀 After setup, restart your backend server:"
echo "   npm run dev"
echo ""
