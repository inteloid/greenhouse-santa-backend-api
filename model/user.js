var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    login: {type: String},
    password: {type: String}
}, {versionKey: false});


module.exports = mongoose.model('users', User);