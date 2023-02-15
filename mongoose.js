const mongoose = require('mongoose');

// ================ CONNECT TO MONGOOSE ================

startMongooseConnection().catch(err => console.log(err));

async function startMongooseConnection() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/secrets');
}