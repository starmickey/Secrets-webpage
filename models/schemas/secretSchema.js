const { Schema } = require('mongoose');
const userSchema = require('./userSchema')

const secretSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: userSchema,
        required: true
    }
});

module.exports = secretSchema;