import firebase from 'firebase';
import 'firebase/firestore';


var firebaseConfig = {
    apiKey: "AIzaSyCF9F6lkYPbpam-HZ64PPipIvtFsDK8PwU",
    authDomain: "smooth-verve-236316.firebaseapp.com",
    databaseURL: "https://smooth-verve-236316.firebaseio.com",
    projectId: "smooth-verve-236316",
    storageBucket: "smooth-verve-236316.appspot.com",
    messagingSenderId: "322864162718",
    appId: "1:322864162718:web:788fc018d11dedce"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.firestore();

  const firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true};
  firestore.settings(settings);

  export default firebase;