const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: Number, required: true},
    country: {type: String, required: true},
    phone: {type: Number, required: true},
    items: [{
        title: {type: String, required: true},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true} 
    }],
    amount: {type: Number, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'}
}, {collection: 'order_collection'});

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);