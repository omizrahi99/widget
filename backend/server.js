const express = require('express');
const bodyParser = require('body-parser'); // To parse the request body
const { User, firestoreOps } = require('./fb');
const { async } = require('@firebase/util');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json()); // Parse JSON request body

const PaymentStatus = {
    PAID: 'paid',
    UNPAID: 'unpaid',
    DUE: 'due'
};

// POST route to add a user
app.post('/add-user', (req, res) => {
    try {
        const { walletAdress, sessionKey, payDate, publicKey, userState } = req.body;

        // Check if all required fields are provided
        if (!walletAdress || !sessionKey || !payDate || !publicKey || !userState) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newUser = new User(walletAdress,sessionKey,payDate,publicKey,userState);
        firestoreOps.addSub(newUser);
        
        res.status(201).json({ message: 'User added successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/user-state/:walletAdress', async (req, res) => {
    try {
        const walletAdress = req.params.walletAdress;
        const user = await firestoreOps.getSub(walletAdr);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the user's state
        res.status(200).json({ userState: user.userState });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET route to fetch the entire user data by walletAdress
app.get('/get-user/:walletAdress', async (req, res) => {
    try {
        const walletAdress = req.params.walletAdress;
        const user = await firestoreOps.getSub(walletAdr);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the entire user data
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function updateDueUsers(){

}
async function checkAndSetDueUsers() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Reset hours, minutes, seconds, and milliseconds
    
    const users = await firestoreOps.getSubList();
    const dueUsers = users.filter(user => {
        const userPayDate = new Date(user.payDate.toDate());  // Assuming payDate is stored as a Firestore Timestamp
        userPayDate.setHours(0, 0, 0, 0);
        return userPayDate.getTime() === today.getTime();
    });

    for (const user of dueUsers) {
        const userToUpdate = User.fromJson(user);  // Convert raw object to User instance
        userToUpdate.userState = 'due';
        await firestoreOps.updateSub(userToUpdate);
    }

    console.log("Updated users with due payment for today.");
}




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    //getPayersFromLastBlock()

    //setInterval(updateUserState, 12000);
});