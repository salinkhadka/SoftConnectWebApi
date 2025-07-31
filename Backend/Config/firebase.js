const admin = require('firebase-admin');
const serviceAccount = require('../softconnect-1082b-firebase-adminsdk-fbsvc-93acc4ae86.json'); // get from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
