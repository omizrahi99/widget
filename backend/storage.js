const fs = require('fs');
const User = require('./user.js');

const DATA_FILE = './users.json';

// Utility function to read the JSON data from file
function readData() {
    try {
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        // If file doesn't exist or other errors, return an empty object
        return {};
    }
}

// Utility function to write the JSON data to file
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

// Add a new user
function addUser(user) {
    const data = readData();
    if (data[user.walletAdress]) {
        throw new Error('User already exists with the given walletAdress.');
    }
    // Convert the user instance to a plain object
    data[user.walletAdress] = {
        walletAdress: user.walletAdress,
        sessionKey: user.sessionKey,
        payDate: user.payDate,
        publicKey: user.publicKey,
        userState: user.userState
    };
    writeData(data);
}
// Get a user by walletAdress
function getUser(walletAdress) {
    const data = readData();
    return data[walletAdress] || null;
}

// Return a list of all users
function listUsers() {
    const data = readData();
    return Object.values(data);
}

function updateUser(walletAdress, userState) {
    const data = readData();

    const user = data[walletAdress];
    if (!user) {
        throw new Error('User not found with the given walletAdr.');
    }

    // Update the userState
    user.userState = userState;

    // Save back to storage
    writeData(data);
}


module.exports = {
    addUser,
    getUser,
    listUsers
};
