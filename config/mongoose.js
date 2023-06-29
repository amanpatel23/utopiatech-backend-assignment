const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/utopia_tech');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to the database: MongoDB'));
db.once('open', () => console.log('connected to the database: MongoDB'));

module.exports = db;