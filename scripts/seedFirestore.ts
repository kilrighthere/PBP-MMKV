/**
 * Script untuk menambahkan data dummy mahasiswa ke Firestore
 * 
 * CARA MENGGUNAKAN:
 * 1. Pastikan sudah login di aplikasi minimal sekali
 * 2. Buka Firebase Console: https://console.firebase.google.com/
 * 3. Pilih project: pbpmobile-51a40
 * 4. Buka Firestore Database
 * 5. Klik "Start collection"
 * 6. Collection ID: mahasiswa
 * 7. Tambahkan document dengan data berikut:
 * 
 * Document 1:
 * {
 *   nim: "202101001",
 *   nama: "Budi Santoso",
 *   jurusan: "Teknik Informatika",
 *   email: "budi@example.com"
 * }
 * 
 * Document 2:
 * {
 *   nim: "202101002",
 *   nama: "Siti Nurhaliza",
 *   jurusan: "Sistem Informasi",
 *   email: "siti@example.com"
 * }
 * 
 * Document 3:
 * {
 *   nim: "202101003",
 *   nama: "Ahmad Rizki",
 *   jurusan: "Teknik Komputer",
 *   email: "ahmad@example.com"
 * }
 * 
 * Document 4:
 * {
 *   nim: "202101004",
 *   nama: "Dewi Lestari",
 *   jurusan: "Teknik Informatika",
 *   email: "dewi@example.com"
 * }
 * 
 * Document 5:
 * {
 *   nim: "202101005",
 *   nama: "Eko Prasetyo",
 *   jurusan: "Sistem Informasi",
 *   email: "eko@example.com"
 * }
 * 
 * ATAU gunakan function berikut di aplikasi (uncomment dan panggil):
 */

import { db } from '@/config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

export const seedMahasiswa = async () => {
  const mahasiswaData = [
    {
      nim: '202101001',
      nama: 'Budi Santoso',
      jurusan: 'Teknik Informatika',
      email: 'budi@example.com',
    },
    {
      nim: '202101002',
      nama: 'Siti Nurhaliza',
      jurusan: 'Sistem Informasi',
      email: 'siti@example.com',
    },
    {
      nim: '202101003',
      nama: 'Ahmad Rizki',
      jurusan: 'Teknik Komputer',
      email: 'ahmad@example.com',
    },
    {
      nim: '202101004',
      nama: 'Dewi Lestari',
      jurusan: 'Teknik Informatika',
      email: 'dewi@example.com',
    },
    {
      nim: '202101005',
      nama: 'Eko Prasetyo',
      jurusan: 'Sistem Informasi',
      email: 'eko@example.com',
    },
  ];

  try {
    for (const data of mahasiswaData) {
      await addDoc(collection(db, 'mahasiswa'), data);
      console.log('Added:', data.nama);
    }
    console.log('✅ Semua data mahasiswa berhasil ditambahkan!');
  } catch (error) {
    console.error('❌ Error menambahkan data:', error);
  }
};
