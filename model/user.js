var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    login: {type: String, unique : true, required : true },
    password: {type: String, required:true}
}, {versionKey: false});

module.exports = mongoose.model('users', User);