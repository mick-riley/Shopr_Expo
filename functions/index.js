const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.authOnCreate = functions.auth.user().onCreate(user => {
    db.collection("users")
    .doc(user.uid)
    .set({
        name: user.displayName,
        email: user.email,
        listedItems: [],
        listCount: 0
    })
    .then(result => {
        console.log("User created:", result);
        return;
    })
    .catch(error => {
        console.error(error);
        return;
    })
})

exports.createInitialList = functions.firestore
    .document('users/{userID}')
    .onCreate((snap, context) => {
        const userID = context.params.userID;
        db.collection("users").doc(userID)
        .collection("lists").doc("1")
        .set({
            name: "My First List",
            budget: 0.00,
            todos: []
        }).then(result => {
            console.log(result);
            return ;
        }).catch(error => {
            console.error(error);
            return ;
        })
    })

exports.createListCounter = functions.firestore
.document('users/{userID}')
.onCreate((snap, context) => {
    const userID = context.params.userID;
    db.collection("users").doc(userID).
    collection("lists").doc("--totalLists--").set({
        count: 1
    }).then(result => {
        console.log(result);
        return ;
    }).catch(error => {
        console.error(error);
        return ;
    })
})

exports.updateListCounter = 
    functions.firestore
    .document('users/{userID}/lists/{listID}')
    .onCreate((snap, context) => {
        const userID = context.params.userID;
        db.collection("users").doc(userID).update({
            listCount: FieldValue.increment(1)
        })
    })