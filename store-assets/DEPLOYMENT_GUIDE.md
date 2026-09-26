# Alias Quest — Store Deployment Guide

## Prerequisites

- [ ] Node.js 18+
- [ ] EAS CLI: `npm install -g eas-cli`
- [ ] Apple Developer account ($99/yr) — for iOS
- [ ] Google Play Console account ($25 one-time) — for Android

---

## Step 1: EAS Project Setup

```bash
# Login to your Expo account (create one at expo.dev if needed)
eas login

# Initialize the project (generates a project ID)
eas init

# This updates app.json with your real project ID
```

## Step 2: Configure Credentials

### iOS
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app with bundle ID `com.aliasquest.app`
3. Note your **App Store Connect App ID** and **Team ID**
4. Update `eas.json` → `submit.production.ios`:
   ```json
   "appleId": "your@email.com",
   "ascAppId": "1234567890",
   "appleTeamId": "ABCDE12345"
   ```

### Android
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Create a service account key: Play Console → Setup → API access → Create service account
4. Download the JSON key → save as `credentials/google-play-key.json`
5. Grant the service account "Release manager" permissions

```bash
mkdir -p credentials
# Move your downloaded key here
mv ~/Downloads/your-key.json credentials/google-play-key.json
```

> Add `credentials/` to `.gitignore` — never commit service account keys.

## Step 3: Build

```bash
# Preview build (APK for testing)
eas build --platform android --profile preview

# Production builds
eas build --platform android --profile production
eas build --platform ios --profile production
```

First iOS build will prompt you to configure signing — EAS handles this automatically.

## Step 4: App Store Screenshots

Open `store-assets/screenshots.html` in a browser. For each phone frame:

### iPhone (6.7" display — required)
- Set browser to 1290×2796 (or screenshot at 2x from the mockup)
- Take 5 screenshots: Home, Game, Settings, Stats, Game Over

### Android (Phone)
- 1080×2340 minimum
- Same 5 screens

You can use tools like [Screenshots.pro](https://screenshots.pro) to add device frames.

## Step 5: Submit

```bash
# Submit to App Store (review takes 1-3 days)
eas submit --platform ios --profile production

# Submit to Google Play (internal track, then promote)
eas submit --platform android --profile production
```

## Step 6: Store Listings

Copy text from `store-assets/STORE_LISTING.md` into:

### App Store Connect
- App Name: `Alias Quest`
- Subtitle: `Jocul de Cuvinte RPG`
- Description: Romanian description from listing
- Keywords: from listing
- Category: Games → Word
- Rating: 4+
- Privacy Policy URL: host `docs/PRIVACY_POLICY.md` on GitHub Pages

### Google Play Console
- Title: `Alias Quest`
- Short description: `Jocul de petrecere cu cuvinte, reimaginat ca o aventură RPG!`
- Full description: Romanian description from listing
- Category: Game → Word
- Content rating: Everyone
- Privacy Policy: same URL

## Step 7: Privacy Policy Hosting

The simplest way — enable GitHub Pages:

1. Go to repo Settings → Pages
2. Source: Deploy from a branch → `main` → `/docs`
3. Your privacy policy will be at:
   `https://wintercape.github.io/alias-game/PRIVACY_POLICY`

Or convert the markdown to HTML and host it.

---

## Quick Reference

| Item | Value |
|------|-------|
| Bundle ID (iOS) | `com.aliasquest.app` |
| Package (Android) | `com.aliasquest.app` |
| Version | 1.0.0 |
| Build Number | 1 |
| Min iOS | 16.0 (Expo default) |
| Min Android API | 24 (Expo default) |
| Rating | 4+ / Everyone |
| Category | Games → Word |
| Languages | Romanian (primary), English |
