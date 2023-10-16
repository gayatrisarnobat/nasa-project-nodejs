const mongoose = require('mongoose');

const MONGO_URL =
	'mongodb+srv://gayatrisarnobat:2ygfeX3c2U50JYMB@nasacluster.frw9gye.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready!');
});

mongoose.connection.once('error', (err) => {
	console.error(err);
});

const mongoConnect = async () => {
	await mongoose.connect(MONGO_URL);
}

const mongoDisconnect = async () => {
	await mongoose.disconnect();
}

module.exports = {
	mongoConnect,
	mongoDisconnect,
}