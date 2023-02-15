require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 5;
 

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

        bcrypt.hash(password, saltRounds, function(err, securePassword) {

            if (err) {
                reject(err);
                
            } else {
                const newUser = new User({
                    email: email,
                    password: securePassword
                })
        
                newUser.save().then(
                    function onfullfilled(user) {
                        resolve('success');
                    },
                    function onrejected(reason) {
                        reject(reason);
                    }
        
                )
                
            }
        });
        
        
    })
}


exports.login = function (username, password) {
    
    return new Promise((resolve, reject) => {
        
        User.findOne({email: username}, function (error, user) {
            if(error){
                reject(error);

            } else if (!user) {
                reject('user not found');

            } else {
                bcrypt.compare(password, user.password, function(err, result) {
                    if(err) {
                        reject(err);
                    } else if (!result) {
                        reject('password incorrect');
                    } else {
                        resolve('log in successfull');
                    }
                });
            }
        })

    })
}