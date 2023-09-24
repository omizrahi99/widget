const express = require('express');
const bodyParser = require('body-parser'); // To parse the request body
const { addUser } = require('./storage.js');
const {getPayersFromLastBlock} = require('./ethereum.js');

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

        addUser(walletAdress, sessionKey, payDate, publicKey, userState);
        res.status(201).json({ message: 'User added successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/user-state/:walletAdress', (req, res) => {
    try {
        const walletAdress = req.params.walletAdress;
        const user = getUser(walletAdr);

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
app.get('/get-user/:walletAdress', (req, res) => {
    try {
        const walletAdress = req.params.walletAdress;
        const user = getUser(walletAdress);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the entire user data
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


async function updateUserState() {
    const payers = await getPayersFromLastBlock();

    payers.forEach(payerAddress => {
        Storage.updateUserState(payerAddress,PAID)
    });
}



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    getPayersFromLastBlock()

    setInterval(updateUserState, 12000);
});