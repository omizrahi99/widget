const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, addDoc,Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const serviceAccount = require('./firebaseKey.json');

initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();
module.exports = {
    addSub: async (Subscription) => {
        try {
            const docRef = db.collection('merchant1').doc(Subscription.id);
            await docRef.set(Subscription);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    },
    getSubList: async () => {
        docs=[]
        const merchantRef = db.collection('merchant1');
        const snapshot = await merchantRef.get();
        console.log(snapshot)
        snapshot.forEach(doc => {
            docs.push(doc.data());
          });
        console.log(docs)
        return docs
    }
}
