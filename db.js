const firebase = require("firebase");
const config = require("./config");

const app = firebase.initializeApp(config.firebaseConfig);

const db = app.firestore();

module.exports = db;
