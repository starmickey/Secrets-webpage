const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

// database connection
const mongodbUrl = process.env.MONGODB_URL;
mongoose
    .set('strictQuery', false)
    .connect(mongodbUrl)
    .then(() => console.log('db connected'))
    .catch((error) => console.log(error));

