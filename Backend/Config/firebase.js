const admin = require('firebase-admin');
const serviceAccount = require('../softconnect-1082b-firebase-adminsdk-fbsvc-783882f35c.json'); // get from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
