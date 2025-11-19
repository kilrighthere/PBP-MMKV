# Firebase Configuration

File konfigurasi Firebase untuk project ini tersedia di `config/firebaseConfig.ts`.

## Services yang tersedia:

- **Authentication** (`auth`): Untuk login/register user
- **Firestore** (`db`): Database NoSQL
- **Analytics** (`analytics`): Analytics (hanya di web)

## Cara menggunakan:

```typescript
// Import di file yang membutuhkan Firebase
import { auth, db } from '@/config/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Contoh: Login
const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Contoh: Register
const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered:', userCredential.user);
  } catch (error) {
    console.error('Registration error:', error);
  }
};

// Contoh: Tambah data ke Firestore
const addData = async () => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date()
    });
    console.log('Document written with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
};
```

## Project Info:
- Project ID: pbpmobile-51a40
- Auth Domain: pbpmobile-51a40.firebaseapp.com
