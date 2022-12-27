import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyD7I7mixwd_RXFVWjSkhIpFv5WTpAoUdPo",
  authDomain: "stripe-payments-1a515.firebaseapp.com",
  projectId: "stripe-payments-1a515",
  storageBucket: "stripe-payments-1a515.appspot.com",
  messagingSenderId: "178179732660",
  appId: "1:178179732660:web:a5b6e20201338e512093e1",
  measurementId: "G-W2ZLCQLQPY",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
