const { async } = require('@firebase/util');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./firebaseKey.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

class User {
    constructor(walletAdress, sessionKey, payDate, publicKey, userState) {
      this.walletAdress = walletAdress;
      this.sessionKey = sessionKey;
      this.payDate = payDate;
      this.publicKey = publicKey;
      this.userState = userState;
    }

    static fromJson(json) {
        return new User(json.walletAdress, json.sessionKey, json.payDate, json.publicKey, json.userState);
    }

    // In your User class
    toObject() {
    return {
        walletAdress: this.walletAdress,
        sessionKey: this.sessionKey,
        payDate: this.payDate,
        publicKey: this.publicKey,
        userState: this.userState
    };
}
}

const firestoreOps = {
    addSub: async (user) => {
        try {
            const docRef = db.collection('merchant1').doc(user.walletAdress);
            await docRef.set(user.toObject()); // set the user object
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    },
    addTran: async (tran)=>{
        try {
            console.log(tran.hash)
            const docRef = db.collection('transactions').doc(tran.hash);
            await docRef.set(tran);
            console.log("Document written with ID: ", docRef.hash);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    },

    getSubList: async () => {
        const docs = [];
        const merchantRef = db.collection('merchant1');
        const snapshot = await merchantRef.get();
        snapshot.forEach(doc => {
            docs.push(doc.data());
        });
        console.log(docs);
        return docs;
    },
    getSub: async(walletAdress) => {
        const docRef = db.collection('merchant1').doc(walletAdress);
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
            console.log('Document data:', docSnapshot.data());
            return docSnapshot.data();
        } else {
            console.log('Document does not exist');
            return null;
        }
    },
    updateSub: async (user) => {
        try {
            const docRef = db.collection('merchant1').doc(user.walletAdress);
            await docRef.update(user.toObject()); // update the user object
            console.log("Document updated with ID: ", docRef.id);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }
};

module.exports = {
    User,
    firestoreOps
};