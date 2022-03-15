var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
    first_name: {type: String, maxLength: 10, required: true},
    last_name: {type: String, maxLength: 10, required: true},
    username: {type: String},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: "Customer"},
    liked: {type: Array, default: []}
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

module.exports = mongoose.model('User', userSchema);
