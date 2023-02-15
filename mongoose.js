const mongoose = require('mongoose');

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