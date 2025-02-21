// firebase_initialization.js

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDfqU86jc3ycXWjLQHf8V1PDZKbvz7TO80",
    authDomain: "bestprofessors-b58bf.firebaseapp.com",
    projectId: "bestprofessors-b58bf",
    storageBucket: "bestprofessors-b58bf.appspot.com",
    messagingSenderId: "333924218376",
    appId: "1:333924218376:web:b91a2b270352a9a37d43bd",
    measurementId: "G-DPBYPGK7GV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Use Firestore

// Export Firestore instance to use in other files
export { db };
