# Poker Chips Counter

A real-time poker chips tracking web application built with Next.js, TypeScript, and Firebase.

## Features

- 🎰 **Session Management**: Create or join poker sessions with unique codes
- 🔒 **Optional Password Protection**: Secure your sessions with passwords  
- 👥 **Player Management**: Add and manage multiple players
- 💰 **Chip Tracking**: Real-time chip count updates for all players
- 📊 **Buy-in Management**: Track buy-ins and calculate profit/loss
- 📱 **Mobile Responsive**: Optimized for both Android and iOS devices
- 🔄 **Real-time Sync**: All changes sync instantly across all devices

## Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd poker-chips-counter
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (for now)
   - Select a location

4. Get your Firebase config:
   - Go to Project Settings → General → Your apps
   - Click "Add app" → Web app
   - Copy the config object

### 3. Environment Setup

Create `.env.local` (for development):
```bash
cp .env.example .env.local
```

Fill in your Firebase configuration in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Deployment (Firebase Hosting)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/project/poker-chips-counter)
2. Navigate to Firestore Database → Create database
3. Choose "Start in test mode"
4. Select your preferred region

### 4. Deploy to Firebase Hosting
```bash
npm run deploy
```

This will:
- Build the Next.js app for static export
- Deploy to Firebase Hosting
- Deploy Firestore security rules

Your app will be available at: `https://poker-chips-counter.web.app`

### Alternative: Manual Deploy
```bash
npm run build
firebase deploy --only hosting
```

## Firebase Security Rules

For production, update your Firestore rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read, write: if true;
    }
  }
}
```

Note: These are permissive rules for simplicity. For production, consider adding proper authentication.

## Usage

1. **Create Session**: Generate a unique 6-character code and optional password
2. **Join Session**: Enter the session code and password (if required)  
3. **Add Players**: Add players with their names
4. **Track Chips**: Update chip counts and add buy-ins
5. **Real-time Updates**: All participants see changes instantly

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Deployment**: Vercel
- **Real-time**: Firebase real-time listeners

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles  
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── session/        # Session pages
├── lib/                # Utilities
│   ├── firebase.ts     # Firebase config
│   └── sessions.ts     # Session management
└── types/              # TypeScript types
```

## Additional Features to Consider

- **Game Timer**: Track session duration
- **Blind Structure**: Configurable blinds with timer
- **Tournament Mode**: Elimination tracking
- **Statistics**: Historical session data
- **Export**: CSV/PDF reports
- **Push Notifications**: Session updates

## Support

For issues or questions, please create an issue in the GitHub repository.