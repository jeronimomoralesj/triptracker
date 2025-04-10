// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your own Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyAKFcyxjAvaP8HC_9-RINWnpZWwXpg57OA",
    authDomain: "aluna-7994b.firebaseapp.com",
    databaseURL: "https://aluna-7994b-default-rtdb.firebaseio.com",
    projectId: "aluna-7994b",
    storageBucket: "aluna-7994b.appspot.com",
    messagingSenderId: "4345553039",
    appId: "1:4345553039:web:a32a0fd5d48648caed50fa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };