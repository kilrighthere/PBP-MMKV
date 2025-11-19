# MMKV Storage Implementation

## 📦 Package yang Digunakan
- `react-native-mmkv` - Fast, secure key-value storage untuk React Native

## 🏗️ Struktur File

### `utils/storage.ts`
File utama untuk manajemen storage menggunakan MMKV.

#### Functions:
- `saveUserData(userId, email, userName?)` - Simpan data user saat login
- `clearUserData()` - Hapus semua data user (digunakan saat logout)
- `getUserData()` - Ambil data user dari storage
- `isUserLoggedIn()` - Check apakah user sudah login
- `setItem(key, value)` - Set generic item
- `getItem(key)` - Get generic item
- `removeItem(key)` - Remove specific item
- `clearAll()` - Clear semua storage

#### Storage Keys:
```typescript
STORAGE_KEYS = {
  USER_EMAIL: 'user_email',
  USER_ID: 'user_id',
  IS_LOGGED_IN: 'is_logged_in',
  USER_NAME: 'user_name',
}
```

## 🔄 Flow Implementasi

### 1. **Splash Screen** (`app/index.tsx`)
```
1. Cek MMKV storage
2. Jika isLoggedIn = true → redirect ke /home
3. Jika isLoggedIn = false → redirect ke /login
```

### 2. **Login Screen** (`app/login.tsx`)
```
1. User input email & password
2. Authenticate dengan Firebase Auth
3. Jika berhasil:
   - Simpan userId, email, userName ke MMKV
   - Set isLoggedIn = true
   - Redirect ke /home
```

### 3. **Home Screen** (`app/home.tsx`)
```
1. Saat mount:
   - Cek MMKV untuk data user (fast)
   - Display email dari MMKV
   - Verify dengan Firebase Auth (background)
   
2. Saat logout:
   - Clear MMKV storage
   - Sign out dari Firebase
   - Redirect ke /login
```

## 🎯 Keuntungan MMKV

✅ **Super Fast** - 30x lebih cepat dari AsyncStorage
✅ **Synchronous** - Tidak perlu async/await untuk operasi sederhana
✅ **Type Safe** - Support string, number, boolean
✅ **Encrypted** - Data tersimpan dengan aman
✅ **Small Size** - Lebih ringan dari alternatif lain

## 📝 Contoh Usage

### Simpan Login State
```typescript
import { saveUserData } from '@/utils/storage';

// Saat login berhasil
const user = userCredential.user;
saveUserData(user.uid, user.email, user.displayName);
```

### Check Login State
```typescript
import { getUserData, isUserLoggedIn } from '@/utils/storage';

// Quick check
if (isUserLoggedIn()) {
  console.log('User sudah login');
}

// Get full data
const userData = getUserData();
console.log(userData.email, userData.userId);
```

### Logout
```typescript
import { clearUserData } from '@/utils/storage';

// Hapus semua data user
clearUserData();
await signOut(auth);
```

## 🔐 Security

MMKV menyimpan data secara terenkripsi di device local storage:
- **iOS**: NSUserDefaults dengan encryption
- **Android**: SharedPreferences dengan encryption

Data **TIDAK** tersimpan di cloud, hanya di device.

## 🚀 Performance

Perbandingan dengan AsyncStorage:
- **Read**: 30x lebih cepat
- **Write**: 10x lebih cepat
- **Synchronous**: Tidak ada callback hell

## 📱 Testing

1. **Test Login State Persistence**:
   - Login ke aplikasi
   - Close app (force quit)
   - Buka app lagi → Harusnya langsung ke home tanpa login ulang

2. **Test Logout**:
   - Logout dari app
   - Close app
   - Buka app lagi → Harusnya ke login screen

3. **Test Multiple Users**:
   - Login dengan user A
   - Logout
   - Login dengan user B
   - Data harusnya berubah sesuai user B

## 🐛 Debugging

Untuk melihat data di MMKV:
```typescript
import { storage } from '@/utils/storage';

// List all keys
const allKeys = storage.getAllKeys();
console.log('MMKV Keys:', allKeys);

// Check specific value
console.log('Is Logged In:', storage.getBoolean('is_logged_in'));
console.log('User Email:', storage.getString('user_email'));
```

## 🔄 Migration dari AsyncStorage

Jika sebelumnya pakai AsyncStorage:
```typescript
// OLD (AsyncStorage)
await AsyncStorage.setItem('key', 'value');
const value = await AsyncStorage.getItem('key');

// NEW (MMKV)
storage.set('key', 'value');
const value = storage.getString('key');
```

Keuntungan: Tidak perlu async/await = lebih cepat dan clean code!
