require('dotenv').config();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


// ================ CONNECT TO MONGOOSE ================

startMongooseConnection().catch(err => console.log(err));

async function startMongooseConnection() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/secrets');
}


// ================== MODELS & SCHEMAS ==================

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(encrypt, {
    secret: process.env.ECRYPTION_STRING,
    encryptedFields: ['password']
});

const User = mongoose.model('user', userSchema);



// =================== EXPORT METHODS ===================

exports.registerUser = function (email, password) {
    
    return new Promise((resolve, reject) => {
        
        const newUser = new User({
            email: email,
            password: password
        })

        newUser.save().then(
            function onfullfilled(user) {
                resolve('success');
            },
            function onrejected(reason) {
                reject(reason);
            }

        )
        
    })
}


exports.login = function (username, password) {
    
    return new Promise((resolve, reject) => {
        
        User.findOne({email: username}, function (error, user) {
            if(error){
                reject(error);

            } else if (!user) {
                reject('user not found');

            } else if (user.password !== password) {
                reject('password incorrect');

            } else {
                resolve('success');

            }
        })

    })
}