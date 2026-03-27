# Google Vision API Setup for LokSetu

## Quick Start (5 minutes)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Create Project"
3. Name it "LokSetu-Vision" or similar
4. Click Create

### Step 2: Enable Vision API
1. In the console, search for "Vision API"
2. Click on "Cloud Vision API"
3. Click "Enable"

### Step 3: Create API Credentials

**Option A: API Key (Easier, good for development)**
1. Go to "Credentials" tab
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Add to `.env` file in backend folder:
```bash
GOOGLE_VISION_API_KEY=your_key_here
```

**Option B: Service Account (Better for production)**
1. Go to "Credentials" tab
2. Click "Create Credentials" → "Service Account"
3. Fill in service account details
4. Click "Create and Continue"
5. Click "Create Key" → JSON
6. Save the JSON file somewhere safe (e.g., `C:\LokSetu\vision-credentials.json`)
7. In backend `.env`:
```bash
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\vision-credentials.json
```

### Step 4: Test the Setup

```bash
cd backend
node test-vision.js
```

You should see:
```
✅ Vision API: Connected and working!
📸 Sample detection: [List of detected objects]
```

## Environment Setup

### Windows PowerShell

To set environment variable for current session:
```powershell
$env:GOOGLE_VISION_API_KEY = "your_key_here"
```

To set permanently:
```powershell
[Environment]::SetEnvironmentVariable("GOOGLE_VISION_API_KEY", "your_key_here", "User")
```

Then restart PowerShell.

### Linux/macOS

Add to `~/.bashrc` or `~/.zshrc`:
```bash
export GOOGLE_VISION_API_KEY="your_key_here"
```

Then run:
```bash
source ~/.bashrc
```

## How It Works Now

### Image Upload Flow
1. **User uploads image** with complaint about "Water Leak"
2. **Vision API detects objects** in the image (e.g., "street light", "electrical pole")
3. **System checks relevance** - do detected objects match "Water & Sanitation" category?
4. **Low relevance score** - streetlight ≠ water pipe
5. **Admin sees warning** - "Detected objects may not match complaint category"
6. **Admin decision** - Accept or reject the image upload

### Detection Accuracy

The system now detects:
- **Roads**: potholes, cracks, damaged pavement
- **Water & Sanitation**: pipes, drains, water leaks
- **Electricity**: power lines, streetlights, transformers
- **Sanitation**: garbage, trash, waste
- **Infrastructure**: buildings, broken structures
- **Encroachment**: vehicles, illegal structures
- **Environment**: trees, pollution, smoke
- **Parks**: playgrounds, benches, green spaces
- **Noise Pollution**: crowds, construction, loudspeakers

### Example Scenarios

| Complaint | Image | Result | Admin Sees |
|-----------|-------|--------|-----------|
| Water Leak | Pipe with water | ✅ Match | ✅ Approved |
| Water Leak | Streetlight | ❌ Mismatch | ⚠️ Warning |
| Pothole | Road damage | ✅ Match | ✅ Approved |
| Pothole | Tree image | ❌ Mismatch | ⚠️ Warning |

## Troubleshooting

### "Vision API not configured"
- Check `.env` file has `GOOGLE_VISION_API_KEY` or `GOOGLE_APPLICATION_CREDENTIALS`
- Restart backend server
- Run `node test-vision.js` to verify

### "API not enabled"
- Go to Google Cloud Console
- Search "Vision API"
- Click "Enable"
- Wait 1-2 minutes for activation

### "Permission denied"
- Verify credentials file path is correct
- On Windows, use absolute path: `C:\Users\YourName\vision-creds.json`
- Check file permissions are readable

### "Quota exceeded"
- First 1000 images/month are free
- Check usage in [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)

## Pricing

**Free Tier**: 1,000 requests/month for object detection
**After that**: $1.50 per 1,000 requests

For a civic complaint system:
- 100 complaints/day = 3,000/month = mostly free
- 1000 complaints/day = 30,000/month ≈ $45/month

## Next Steps

1. Set up credentials (follow Step 3 above)
2. Add to `.env`:
   ```
   GOOGLE_VISION_API_KEY=your_key
   ```
3. Restart backend: `npm run dev`
4. Test: `node test-vision.js`
5. Upload an image with wrong category - system should detect mismatch!

## Documentation links
- [Google Vision API Docs](https://cloud.google.com/vision/docs)
- [Object Detection Guide](https://cloud.google.com/vision/docs/detecting-objects)
- [API Pricing](https://cloud.google.com/vision/pricing)
