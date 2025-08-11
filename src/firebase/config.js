import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXfIFi6f4mLYLO2wiwEf16SFBaSbloHiA",
  authDomain: "absensi-paduan-suara.firebaseapp.com",
  projectId: "absensi-paduan-suara",
  storageBucket: "absensi-paduan-suara.firebasestorage.app",
  messagingSenderId: "1044452180936",
  appId: "1:1044452180936:web:616fc38b307cd936e9b6fd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection };