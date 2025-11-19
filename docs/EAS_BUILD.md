# 🏗️ Building dengan EAS (Expo Application Services)

## Prerequisites
- Akun Expo (gratis): https://expo.dev/signup
- EAS CLI terinstall: `npm install -g eas-cli@latest`
- Login ke EAS: `eas login`

## Build Profiles

### 1. Development Build (Untuk Testing dengan Expo Dev Client)
```bash
eas build --profile development --platform android
```
- Menghasilkan APK development
- Bisa connect ke Metro bundler
- Cocok untuk testing dengan hot reload

### 2. Preview Build (Internal Testing)
```bash
eas build --profile preview --platform android
```
- Menghasilkan APK standalone
- Tidak butuh Metro bundler
- Cocok untuk internal testing/QA

### 3. Production Build (Release ke Play Store)
```bash
eas build --profile production --platform android
```
- Menghasilkan APK/AAB production-ready
- Otomatis increment version
- Siap upload ke Google Play Store

## Build Commands

### Cloud Build (Recommended - Works on Windows)
```bash
# Android only
eas build --profile development --platform android

# iOS only (requires Mac for local build)
eas build --profile development --platform ios

# Both platforms
eas build --profile development --platform all
```

### Local Build (Requires Linux/macOS)
```bash
eas build --profile development --platform android --local
```
⚠️ **Catatan**: Local build tidak support Windows!

## Monitor Build Progress

### Via CLI
```bash
# Lihat status build
eas build:list

# Lihat detail build tertentu
eas build:view [BUILD_ID]
```

### Via Web
Buka: https://expo.dev/accounts/[USERNAME]/projects/CobaMMKV/builds

## Download Build

Setelah build selesai:
1. Cek email dari Expo
2. Atau via CLI:
   ```bash
   eas build:list
   ```
3. Download APK dari link yang diberikan
4. Install APK di device Android

## Troubleshooting

### Error: "Build command failed"
**Solusi**:
1. Update EAS CLI: `npm install -g eas-cli@latest`
2. Re-configure project: `eas build:configure`
3. Check `eas.json` configuration

### Error: "Unsupported platform" (Local Build)
**Solusi**: 
- Gunakan cloud build (remove `--local` flag)
- Atau gunakan Linux/macOS untuk local build

### Error: "Not logged in"
**Solusi**:
```bash
eas login
eas whoami  # verify login
```

### Build Failed karena Dependencies
**Solusi**:
1. Pastikan semua dependencies terinstall:
   ```bash
   npm install
   ```
2. Clear cache dan reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Development Workflow

1. **Develop locally**:
   ```bash
   npx expo start
   ```

2. **Test on device with dev build**:
   ```bash
   eas build --profile development --platform android
   # Install APK, then run: npx expo start
   ```

3. **Internal testing**:
   ```bash
   eas build --profile preview --platform android
   ```

4. **Production release**:
   ```bash
   eas build --profile production --platform android
   eas submit -p android  # Submit to Play Store
   ```

## Tips

- 💰 **Free tier**: 30 builds/month (Android + iOS combined)
- ⏱️ **Build time**: 10-20 minutes untuk Android
- 📱 **Install APK**: Enable "Install from Unknown Sources" di device
- 🔄 **Auto updates**: Use EAS Update untuk push updates tanpa rebuild
- 📊 **Monitor**: Check build progress di https://expo.dev

## Resources

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/
