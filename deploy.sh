#!/bin/bash

# Deploy script using SSH keys. It never prompts for a password.

HOST="ssh.cnl0xaemr.service.one"
USER="cnl0xaemr_u"
REMOTE_PATH="/webroots/sites/palmeclub.nl"

echo "🚀 Starting deployment to $HOST"
echo "📂 Remote path: $REMOTE_PATH"
echo ""

if ! ssh -o BatchMode=yes -o ConnectTimeout=10 "$USER@$HOST" "test -d '$REMOTE_PATH'"; then
  echo "❌ SSH key authentication is not configured."
  echo "Run once: ssh-copy-id -i ~/.ssh/id_rsa.pub $USER@$HOST"
  exit 1
fi

rsync -az \
  --exclude '.git/' \
  --exclude '.gitignore' \
  --exclude '.sftp-config.json' \
  --exclude 'node_modules/' \
  --exclude 'deploy.js' \
  --exclude 'deploy.sh' \
  --exclude 'find-ftp-path.js' \
  --exclude 'test-ftp.js' \
  --exclude 'package.json' \
  --exclude 'package-lock.json' \
  --exclude '.DS_Store' \
  -e 'ssh -o BatchMode=yes' \
  ./ "$USER@$HOST:$REMOTE_PATH/"

echo "✅ Deployment complete: https://palmeclub.nl"
