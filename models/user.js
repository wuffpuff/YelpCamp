const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//define user schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//harmonize UserSchema with "passport-local-mongoose" package
//by this way, "passportLocalMongoose" adds username and password to UserSchema
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);


//Passport-Local-Mongoose = will add a username, hash and salt field to store the username
//the hashed password and the salt value