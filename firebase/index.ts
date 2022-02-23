import { initializeApp } from 'firebase/app';
import { getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDGpfsoY3kWske0NUQUtaLo5C05VXaxej4',
  authDomain: 'ily-todo-ec6bb.firebaseapp.com',
  projectId: 'ily-todo-ec6bb',
  storageBucket: 'ily-todo-ec6bb.appspot.com',
  messagingSenderId: '913202040493',
  appId: '1:913202040493:web:0b6ae36306c80dea618024',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const timestamp = serverTimestamp();
// console.log(timestamp.toDate());
