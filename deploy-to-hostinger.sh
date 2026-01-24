#!/bin/bash

# Hostinger Deployment Script
# This script uploads your app to Hostinger and starts it

set -e

# Configuration
HOSTINGER_IP="92.113.28.12"
HOSTINGER_PORT="65002"
HOSTINGER_USER="u35502316"
HOSTINGER_PASS="Catpatches57@"
REMOTE_PATH="/home/${HOSTINGER_USER}/public_html"

echo "🚀 Starting Hostinger deployment..."
echo ""

# Create SFTP batch file
cat > sftp_commands.txt << 'EOF'
cd public_html
put server.js
put package.json
put package-lock.json
put .env
put -r frontend
put -r backend
bye
EOF

echo "📤 Uploading files via SFTP..."
sshpass -p "${HOSTINGER_PASS}" sftp -P ${HOSTINGER_PORT} ${HOSTINGER_USER}@${HOSTINGER_IP} < sftp_commands.txt

echo "✅ Files uploaded successfully!"
echo ""

echo "🔧 Installing dependencies and starting app..."
sshpass -p "${HOSTINGER_PASS}" ssh -p ${HOSTINGER_PORT} ${HOSTINGER_USER}@${HOSTINGER_IP} << 'ENDSSH'
cd public_html
echo "📦 Installing npm dependencies..."
npm install
echo ""
echo "🚀 Starting the app..."
npm start &
sleep 3
echo ""
echo "✅ App started! Checking status..."
lsof -i :5001 || echo "⚠️  Check with: curl http://localhost:5001"
ENDSSH

echo ""
echo "✅ Deployment complete!"
echo "Visit: https://becreativesd.com"
