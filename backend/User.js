
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true
    }
})
  
User.plugin(passportLocalMongoose);

User.method({
    async authenticate(password) {
        return bcrypt.compare(password, this.password);
    }
});
  
module.exports = mongoose.model('User', User)