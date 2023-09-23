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
    if (data[user.walletAdressess]) {
        throw new Error('User already exists with the given walletAdress.');
    }
    // Convert the user instance to a plain object
    data[user.walletAdressess] = {
        walletAdressess: user.walletAdressess,
        sessionKey: user.sessionKey,
        payDate: user.payDate,
        publicKey: user.publicKey,
        userState: user.userState
    };
    writeData(data);
}
// Get a user by walletAdress
function getUser(walletAdressess) {
    const data = readData();
    return data[walletAdress] || null;
}

// Return a list of all users
function listUsers() {
    const data = readData();
    return Object.values(data);
}

module.exports = {
    addUser,
    getUser,
    listUsers
};
