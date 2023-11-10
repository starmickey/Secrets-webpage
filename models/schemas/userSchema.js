const { Schema } = require('mongoose');

const userSchema = new Schema({
    googleId: String,
    facebookId: String,
    // active attribute is false if the account has been disabled
    active: Boolean
});


module.exports = userSchema;









