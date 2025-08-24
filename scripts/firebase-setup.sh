#!/bin/bash

# Firebase Setup Script
echo "🔥 Setting up Firebase project..."

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 20
echo "📦 Using Node.js 20..."
nvm use 20

# Check if logged in
if ! firebase projects:list >/dev/null 2>&1; then
  echo "🔐 Please login to Firebase first:"
  echo "firebase login"
  exit 1
fi

# Build the app
echo "🏗️ Building Next.js app..."
npm run build

# Deploy Firestore rules
echo "📋 Deploying Firestore rules..."
firebase deploy --only firestore:rules

# Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://poker-chips-counter.web.app"