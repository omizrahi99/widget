const fs = require('fs');

// Save JSON to file
const data = { name: "John", age: 30 };
fs.writeFileSync('data.json', JSON.stringify(data));

// Read JSON from file
const rawData = fs.readFileSync('data.json', 'utf8');
const jsonData = JSON.parse(rawData);