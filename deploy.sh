#!/bin/bash

# Deploy script using SCP via SSH (with SSH keys - no password needed)
# Uploads all website files to the production server

HOST="ssh.cnl0xaemr.service.one"
USER="cnl0xaemr_u"
REMOTE_PATH="/webroots/sites/palmeclub.nl"

echo "🚀 Starting deployment to $HOST"
echo "📂 Remote path: $REMOTE_PATH"
echo ""

# Files to upload
FILES=(
  "index.html"
  "instellingen.html"
  "app.js"
  "config.js"
  "instellingen.js"
  "styles.css"
  "LEESMIJ.md"
  "BRONNEN.md"
  "START-HIER.html"
)

# Upload individual files
uploaded=0
failed=0

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    scp -q "$file" "$USER@$HOST:$REMOTE_PATH/" 2>/dev/null
    if [ $? -eq 0 ]; then
      echo "✅ Uploaded: $file"
      ((uploaded++))
    else
      echo "❌ Failed: $file"
      ((failed++))
    fi
  fi
done

# Upload assets directory
echo ""
echo "📤 Uploading assets..."
scp -rq assets "$USER@$HOST:$REMOTE_PATH/" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "✅ Assets uploaded"
else
  echo "❌ Assets upload failed"
  ((failed++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment complete!"
echo "📤 $uploaded files uploaded"
if [ $failed -gt 0 ]; then
  echo "⚠️  $failed files failed"
fi
echo "🌐 Your website is live at: https://palmeclub.nl"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━""
