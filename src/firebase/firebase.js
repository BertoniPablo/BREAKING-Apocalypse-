import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFTy2st7i9r9r7EIjm8GGsBO3zafKi-Ss",
  authDomain: "breaking-apocalypse.firebaseapp.com",
  projectId: "breaking-apocalypse",
  storageBucket: "breaking-apocalypse.firebasestorage.app",
  messagingSenderId: "28116966455",
  appId: "1:28116966455:web:22d05cba090bd5c3e873b2",
  measurementId: "G-67DBCFYLNQ",
};

//inicializa firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
