# 🚀 Setup Guide - Firebase + MMKV Integration

## Phase 1: Firebase Setup ✅

### 1. Install Firebase SDK
```bash
npm install firebase
```

### 2. Configure Firebase (`config/firebaseConfig.ts`)
```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXjRBot2yTKMNj0z4YK86nAnVL_cDiukM",
  authDomain: "pbpmobile-51a40.firebaseapp.com",
  projectId: "pbpmobile-51a40",
  // ... config lainnya
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 3. Setup Firebase Console
1. Buka https://console.firebase.google.com/
2. Pilih project: **pbpmobile-51a40**
3. **Enable Authentication** → Email/Password
4. **Enable Firestore Database** → Start in test mode
5. Create collection: **mahasiswa**

## Phase 2: Implement Firebase Auth ✅

### 1. Login Screen (`app/login.tsx`)
- ✅ Sign in dengan Firebase Auth
- ✅ Create account (register)
- ✅ Error handling
- ✅ Save user data ke MMKV setelah login

### 2. Home Screen (`app/home.tsx`)
- ✅ Fetch data dari Firestore
- ✅ Real-time authentication check
- ✅ Logout functionality

### 3. Admin Screen (`app/admin.tsx`)
- ✅ Form input manual mahasiswa
- ✅ Bulk insert 8 data sekaligus
- ✅ Add data langsung ke Firestore

## Phase 3: MMKV Storage Implementation ✅

### 1. Install MMKV
```bash
npm install react-native-mmkv
```

### 2. Create Storage Utils (`utils/storage.ts`)
```typescript
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const STORAGE_KEYS = {
  USER_EMAIL: 'user_email',
  USER_ID: 'user_id',
  IS_LOGGED_IN: 'is_logged_in',
  USER_NAME: 'user_name',
};

export const saveUserData = (userId, email, userName?) => {
  storage.set(STORAGE_KEYS.USER_ID, userId);
  storage.set(STORAGE_KEYS.USER_EMAIL, email);
  storage.set(STORAGE_KEYS.IS_LOGGED_IN, true);
  if (userName) storage.set(STORAGE_KEYS.USER_NAME, userName);
};

export const clearUserData = () => {
  storage.delete(STORAGE_KEYS.USER_ID);
  storage.delete(STORAGE_KEYS.USER_EMAIL);
  storage.delete(STORAGE_KEYS.IS_LOGGED_IN);
  storage.delete(STORAGE_KEYS.USER_NAME);
};

export const getUserData = () => ({
  userId: storage.getString(STORAGE_KEYS.USER_ID),
  email: storage.getString(STORAGE_KEYS.USER_EMAIL),
  userName: storage.getString(STORAGE_KEYS.USER_NAME),
  isLoggedIn: storage.getBoolean(STORAGE_KEYS.IS_LOGGED_IN) || false,
});
```

### 3. Implement Auto-Login (`app/index.tsx`)
```typescript
import { getUserData } from '@/utils/storage';

useEffect(() => {
  const userData = getUserData();
  
  if (userData.isLoggedIn) {
    router.replace('/home'); // Auto login
  } else {
    router.replace('/login');
  }
}, []);
```

### 4. Save on Login (`app/login.tsx`)
```typescript
import { saveUserData } from '@/utils/storage';

// Setelah login berhasil
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

// Simpan ke MMKV
saveUserData(user.uid, user.email, user.displayName);
```

### 5. Clear on Logout (`app/home.tsx`)
```typescript
import { clearUserData } from '@/utils/storage';

const handleLogout = async () => {
  clearUserData(); // Clear MMKV
  await signOut(auth); // Logout Firebase
  router.replace('/login');
};
```

## 📁 Project Structure

```
CobaMMKV/
├── app/
│   ├── index.tsx          # Splash + Auto-login check
│   ├── login.tsx          # Login/Register screen
│   ├── home.tsx           # Home screen (list mahasiswa)
│   ├── admin.tsx          # Admin form (add mahasiswa)
│   └── _layout.tsx        # Root layout
├── config/
│   └── firebaseConfig.ts  # Firebase configuration
├── utils/
│   └── storage.ts         # MMKV storage helpers
├── docs/
│   └── MMKV_IMPLEMENTATION.md
└── scripts/
    └── seedFirestore.ts   # Seeding helper
```

## 🔄 User Flow

### First Time User
1. App dibuka → index.tsx
2. Check MMKV → `isLoggedIn = false`
3. Redirect → `/login`
4. User register/login
5. Save to MMKV → `isLoggedIn = true`
6. Redirect → `/home`

### Returning User
1. App dibuka → index.tsx
2. Check MMKV → `isLoggedIn = true`
3. Redirect langsung → `/home` ⚡ (FAST!)
4. Verify dengan Firebase di background

### Logout
1. User klik logout
2. Clear MMKV storage
3. Sign out dari Firebase
4. Redirect → `/login`

## ✅ Features Checklist

- [x] Firebase Authentication (Email/Password)
- [x] Firebase Firestore (CRUD Mahasiswa)
- [x] MMKV Storage Implementation
- [x] Auto-login on app restart
- [x] Persistent login state
- [x] Logout dengan clear storage
- [x] Admin panel untuk add data
- [x] Bulk insert data
- [x] Pull to refresh
- [x] Loading states
- [x] Error handling

## 🎯 Testing Checklist

### Test Login Persistence
- [ ] Login ke aplikasi
- [ ] Force close app (swipe dari recent apps)
- [ ] Buka app lagi
- [ ] ✅ Harusnya langsung masuk ke home tanpa login ulang

### Test Logout
- [ ] Klik tombol logout
- [ ] Force close app
- [ ] Buka app lagi
- [ ] ✅ Harusnya di login screen

### Test Multiple Accounts
- [ ] Login dengan akun A
- [ ] Check data di home
- [ ] Logout
- [ ] Login dengan akun B
- [ ] ✅ Data harusnya berubah sesuai akun B

### Test Offline Behavior
- [ ] Login ke aplikasi
- [ ] Matikan internet
- [ ] Force close app
- [ ] Buka app lagi
- [ ] ✅ Harusnya tetap masuk ke home (karena MMKV)
- [ ] ⚠️ Data mahasiswa tidak akan load (butuh internet)

## 🚀 Running the Project

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📱 Add Data Mahasiswa

### Cara 1: Dari Aplikasi (RECOMMENDED)
1. Login ke app
2. Klik tombol "➕ Tambah Data Mahasiswa"
3. Pilih:
   - Input Manual (1 data)
   - Tambah Bulk (8 data sekaligus)

### Cara 2: Via Firebase Console
1. Buka Firebase Console
2. Firestore Database
3. Collection: mahasiswa
4. Add document dengan fields:
   - nim: string
   - nama: string
   - prodi: string
   - tahunMasuk: string
   - email: string

## 🐛 Common Issues

### Issue: "MMKV not found"
**Solution**: 
```bash
npm install react-native-mmkv
npx expo prebuild --clean
```

### Issue: "Auth persistence warning"
**Solution**: Sudah resolved dengan MMKV implementation

### Issue: Data tidak persist setelah restart
**Solution**: Check implementation `saveUserData()` dan `clearUserData()`

## 📚 Documentation

- [MMKV Implementation Details](./MMKV_IMPLEMENTATION.md)
- [Firebase Config](../config/README.md)

## 🎉 Done!

Project sekarang sudah fully integrated dengan:
- ✅ Firebase Authentication
- ✅ Firebase Firestore
- ✅ MMKV Storage
- ✅ Persistent Login State
- ✅ Auto-login Feature
