import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCkuRf78xMBV_5kP_ayOMEhVQUBx0rPPuI",
  authDomain: "glassweb-65054.firebaseapp.com",
  projectId: "glassweb-65054",
  storageBucket: "glassweb-65054.appspot.com",
  messagingSenderId: "811514008449",
  appId: "1:811514008449:web:0fed535cf85d92dad58e80",
  measurementId: "G-K0GLWCFVZ1"
});

export const auth = app.auth();
export const db = firebase.firestore();
export default app;