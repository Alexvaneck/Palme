#!/bin/bash

# Deploy script using SCP via SSH
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
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📤 Uploading: $file"
    scp -q "$file" "$USER@$HOST:$REMOTE_PATH/"
    if [ $? -eq 0 ]; then
      echo "✅ Uploaded: $file"
    else
      echo "❌ Failed: $file"
    fi
  fi
done

# Upload assets directory
echo ""
echo "📤 Uploading assets..."
scp -rq assets "$USER@$HOST:$REMOTE_PATH/"
if [ $? -eq 0 ]; then
  echo "✅ Assets uploaded"
else
  echo "❌ Assets upload failed"
fi

echo ""
echo "🎉 Deployment complete!"
echo "Your website is live at: https://palmeclub.nl"
