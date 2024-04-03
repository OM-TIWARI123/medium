// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBttnDsHVHTjex4HHeLxOKT7qXET8yF3js",
  authDomain: "crud-app-7332c.firebaseapp.com",
  projectId: "crud-app-7332c",
  storageBucket: "crud-app-7332c.appspot.com",
  messagingSenderId: "697666312540",
  appId: "1:697666312540:web:fb34bb426c91b4735e0999",
  measurementId: "G-55HGFB8J5Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);