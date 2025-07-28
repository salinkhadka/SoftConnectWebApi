const admin = require('firebase-admin');
const serviceAccount = require('../softconnect-1082b-firebase-adminsdk-fbsvc-3064d9dc63.json'); // get from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
