import Firebase from "firebase";

// https://firebase.google.com/docs/firestore/quickstart#set_up_your_development_environment
const firebaseConfig = {
  apiKey: "AIzaSyAocl-0trPVzxwQJnxQs4yB9cmrSyK6Z9U",
  authDomain: "learning-9b244.firebaseapp.com",
  databaseURL: "https://learning-9b244.firebaseio.com",
  projectId: "learning-9b244",
  storageBucket: "learning-9b244.appspot.com",
  messagingSenderId: "735081364011",
  appId: "1:735081364011:web:c4e44e33e6ed689a"
};

export const firebase = Firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const firebaseStorage = firebase.storage().ref();

export default firebase;
