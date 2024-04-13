const fs = require('fs');

let creds = [];

function loadDB() {
    try {
        const data = fs.readFileSync('creds.json', 'utf8');
        creds = JSON.parse(data);
    } catch (err) {
        console.error('Error reading creds.json:', err);
    }
}

function saveDB() {
    try {
        fs.writeFileSync('creds.json', JSON.stringify(creds, null, 2));
    } catch (err) {
        console.error('Error writing creds.json:', err);
    }
}

module.exports = {
    creds,
    loadDB,
    saveDB
};
