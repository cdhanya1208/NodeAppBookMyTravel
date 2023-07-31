const admin = require('firebase-admin');
const serviceAccount = require('../bookmytravel-574f3-firebase-adminsdk-mnyx3-db468c20b5.json');
// Firebase configuration
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function checkIfEmailIsVerified(email) {
    const userRecord = await admin.auth().getUserByEmail(email);
        if (!userRecord.emailVerified) {
            return false;
        } 
    return true;
}

module.exports = { checkIfEmailIsVerified, admin };

