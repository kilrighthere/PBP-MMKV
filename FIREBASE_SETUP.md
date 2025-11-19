# 🔥 Panduan Setup Firebase

## ✅ Yang Sudah Dikerjakan

1. ✅ Firebase SDK sudah terinstall
2. ✅ Konfigurasi Firebase sudah dibuat di `config/firebaseConfig.ts`
3. ✅ Login & Register menggunakan Firebase Auth
4. ✅ Home screen fetch data dari Firestore
5. ✅ Logout menggunakan Firebase Auth

## 📋 Langkah-langkah Setup Firebase Console

### 1. Setup Firebase Authentication

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project: **pbpmobile-51a40**
3. Buka menu **Authentication** (ikon kunci di sidebar kiri)
4. Klik tab **Sign-in method**
5. Klik **Email/Password**
6. **Enable** opsi "Email/Password"
7. Klik **Save**

### 2. Setup Firestore Database

1. Masih di Firebase Console
2. Buka menu **Firestore Database** (ikon database di sidebar kiri)
3. Klik **Create database**
4. Pilih lokasi: **asia-southeast1** (Singapore) atau terdekat
5. Pilih mode: **Start in test mode** (untuk development)
6. Klik **Enable**

### 3. Setup Firestore Rules (Development)

Di Firestore Database, buka tab **Rules** dan ganti dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Klik **Publish**

⚠️ **PENTING**: Rules di atas hanya untuk development. Untuk production, gunakan rules yang lebih ketat!

### 4. Tambah Data Mahasiswa ke Firestore

#### Cara 1: Manual di Firebase Console

1. Buka **Firestore Database**
2. Klik **Start collection**
3. Collection ID: `mahasiswa`
4. Tambahkan document dengan Auto-ID, lalu isi field:
   - `nim` (string): "202101001"
   - `nama` (string): "Budi Santoso"
   - `jurusan` (string): "Teknik Informatika"
   - `email` (string): "budi@example.com"
5. Klik **Save**
6. Ulangi untuk data lainnya (lihat `scripts/seedFirestore.ts`)

#### Cara 2: Menggunakan Script (Lebih Mudah)

1. Tambahkan tombol seed di home screen (temporary)
2. Import dan panggil `seedMahasiswa()` dari `scripts/seedFirestore.ts`
3. Atau tambahkan di home.tsx:

```typescript
import { seedMahasiswa } from '@/scripts/seedFirestore';

// Tambahkan button di home screen:
<TouchableOpacity onPress={seedMahasiswa}>
  <Text>Seed Data</Text>
</TouchableOpacity>
```

## 🧪 Testing Aplikasi

### 1. Register User Baru

1. Buka aplikasi
2. Klik "Daftar di sini"
3. Isi email: `test@example.com`
4. Isi password: `password123`
5. Klik **Daftar**
6. Kembali ke login

### 2. Login

1. Isi email: `test@example.com`
2. Isi password: `password123`
3. Klik **Masuk**
4. Akan redirect ke home screen

### 3. Lihat Data Mahasiswa

- Jika sudah ada data di Firestore, akan muncul list mahasiswa
- Jika belum ada data, akan muncul pesan "Belum Ada Data"
- Pull to refresh untuk reload data

### 4. Logout

- Klik tombol **Logout** di bagian bawah
- Akan kembali ke login screen

## 📁 Struktur Firebase

```
Firebase Project: pbpmobile-51a40
├── Authentication
│   └── Users (email/password)
│       └── test@example.com
│
└── Firestore Database
    └── mahasiswa (collection)
        ├── doc1
        │   ├── nim: "202101001"
        │   ├── nama: "Budi Santoso"
        │   ├── jurusan: "Teknik Informatika"
        │   └── email: "budi@example.com"
        │
        └── doc2 (dan seterusnya...)
```

## 🔑 Fitur yang Sudah Terintegrasi

### Login Screen (`app/login.tsx`)
- ✅ Register dengan Firebase Auth (`createUserWithEmailAndPassword`)
- ✅ Login dengan Firebase Auth (`signInWithEmailAndPassword`)
- ✅ Error handling (email invalid, password salah, dll)
- ✅ Loading state saat proses auth

### Home Screen (`app/home.tsx`)
- ✅ Check auth state dengan `onAuthStateChanged`
- ✅ Fetch data mahasiswa dari Firestore
- ✅ Real-time auth checking (auto redirect ke login jika belum login)
- ✅ Logout dengan `signOut`
- ✅ Pull to refresh
- ✅ Empty state jika belum ada data

## 🔧 Troubleshooting

### Error: "Permission Denied"
- Pastikan Firestore Rules sudah di-setup dengan benar
- Pastikan user sudah login

### Error: "Network Request Failed"
- Cek koneksi internet
- Pastikan Firebase project ID benar di `firebaseConfig.ts`

### Data Tidak Muncul
- Cek apakah collection name sudah benar: `mahasiswa`
- Cek apakah sudah ada data di Firestore Console
- Cek console log untuk error message

### Login Gagal
- Pastikan Firebase Authentication sudah dienable
- Pastikan Email/Password provider sudah diaktifkan
- Cek email dan password sudah terdaftar di Authentication

## 📝 Next Steps

1. ✅ Setup Firebase Console (Authentication & Firestore)
2. ✅ Tambah data mahasiswa ke Firestore
3. ✅ Test register user baru
4. ✅ Test login
5. ✅ Test lihat data mahasiswa
6. ✅ Test logout

## 🎉 Selesai!

Aplikasi sekarang sudah terintegrasi penuh dengan Firebase!
- Authentication menggunakan Firebase Auth
- Data mahasiswa dari Firestore
- Real-time auth checking
- Proper error handling
