import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAoRbLlonU9Gi14DobvQ4SnhViKW6ADmLw",
  authDomain: "aaryan-soni.firebaseapp.com",
  projectId: "aaryan-soni",
  storageBucket: "aaryan-soni.appspot.com",
  messagingSenderId: "138251585033",
  appId: "1:138251585033:web:7a902433905511f1d91ad8",
  measurementId: "G-ZKXFNG4PNP"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);