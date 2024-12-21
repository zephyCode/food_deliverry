const { default: mongoose } = require('mongoose');

const Order = require('../models/order');
const User = require('../models/user');
const HttpError = require('../models/http-errors');

const placeOrder = async(req,res,next) => {
    const {street, city, state, zip, country, phone, items} = req.body;
    const userId = req.params.uid;
    let accEmail;
    let accName;
    try {
        accEmail = await User.findOne({_id: userId}, 'email');
    }
    catch(err) {
        return next(
            new HttpError(
                'No account email found!', 
                404
            )
        );
    }
    try {
        accName = await User.findOne({_id: userId}, 'name');
    }
    catch(err) {
        return next(
            new HttpError(
                'No account name found!', 
                404
            )
        );
    }
    let email = accEmail ? accEmail.email : "";
    let name = accName ? accName.name : "";

    const totalAmount = items.reduce((sum,item) => {
        if(!item.price || !item.quantity) {
            return next(
                new HttpError(
                    'Item data is incompatible',
                    400
                )
            )
        }
        return sum + item.price * item.quantity;
    }, 0);
    const placedOrder = new Order({
        name,
        email,
        street,
        city,
        state,
        zip,
        country,
        phone,
        items,
        amount: totalAmount,
        creator: userId
    });
    let user;
    try {
        user = await User.findById(userId);
    }
    catch(err) {
        return(
            next(
                new HttpError(
                    'Order placing failed! Try again later',
                    500
                )
            )
        );
    }
    if(!user) {
        return(
            next(
                new HttpError(
                    'No user found with the given id',
                    500
                )
            )
        );
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await placedOrder.save({session: sess});
        user.orders.push(placedOrder);
        await user.save({session: sess});
        await sess.commitTransaction();
    }
    catch(err) {
        return(
            next(
                new HttpError(
                    'Order not placed!',
                    500
                )
            )
        );
    }
    res.status(201).json({
        order: placedOrder
    });
}

exports.placeOrder = placeOrder;