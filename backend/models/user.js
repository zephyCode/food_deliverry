const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, minLength: 8},
    orders: [{type: mongoose.Types.ObjectId, required: true, ref: 'Orders'}]
}, {collection: 'user_collection'});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);