const userSchema = require('./schemas/userSchema');
const secretSchema = require('./schemas/secretSchema');

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');


userSchema.plugin(passportLocalMongoose, {
    // Set usernameUnique to false to avoid a mongodb index on the username column!
    usernameUnique: false,

    findByUsername: function (model, queryParameters) {
        // Restrict users search to find only active ones
        queryParameters.active = true;
        return model.findOne(queryParameters);
    }
});

userSchema.plugin(findOrCreate);


const User = mongoose.model('user', userSchema);
const Secret = mongoose.model('secret', secretSchema);

module.exports = { User, Secret }