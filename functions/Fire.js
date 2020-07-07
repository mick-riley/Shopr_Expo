import React from 'react';
import * as firebase from 'firebase';


require("firebase/firestore");

var firebaseConfig = {
    apiKey: "AIzaSyBshHOn2xbJoYerLsWRZ2h4649sdKTKyHk",
    authDomain: "shopr-19a38.firebaseapp.com",
    databaseURL: "https://shopr-19a38.firebaseio.com",
    projectId: "shopr-19a38",
    storageBucket: "shopr-19a38.appspot.com",
    messagingSenderId: "640833500536",
    appId: "1:640833500536:web:b8974a334dfae6d6c7448d",
    measurementId: "G-RK6060NZZ8"
  };
  
  // Initialize Firebase
  
  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

  export const db = firebase.firestore();