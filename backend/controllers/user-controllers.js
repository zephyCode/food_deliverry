const {validationResult} = require('express-validator');

const HttpError = require('../models/http-errors');
const User = require('../models/user');

const signup = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return(
            next(
                new HttpError(
                    'Invalid credentials!',
                    422
                )
            )
        );
    }

    const {name, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    }
    catch(err) {
        return next(
            new HttpError(
                'Something went wrong! Please try again later.', 
                500
            )
        );
    }
    if(existingUser) {
        return next(
            new HttpError(
                'User already exists login instead!',
                422
            )
        );
    }
    const createdUser = new User (
        {
            name,
            email,
            password,
            orders: []
        }
    );
    try {
        await createdUser.save();
    }
    catch(err) {
        return next(
            new HttpError(
                'Signup failed! Please try again',
                500
            )
        );
    }
    res.status(201).json(
        {
            userId: createdUser.id,
            mail: createdUser.email
        }
    );
}

const login = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return (
            next(
                new HttpError(
                    'Invalid login credentials!',
                    422
                )
            )
        );
    }
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email})
    }
    catch(err) {
        return (
            next(
                new HttpError(
                    'Something went wrong!',
                    500
                )
            )
        );
    }
    if(!existingUser) {
        return(
            next(
                new HttpError(
                    'User does not exists! with the provided email. Please sign up first.',
                    422
                )
            )
        )
    }
    if(existingUser.password !== password) {
        return (
            next(
                new HttpError(
                    'Invalid email or password!',
                    401
                )
            )
        );
    }
    res.status(201).json(
        {
            userId: existingUser.id, 
            email: existingUser.email
        }
    );
}

exports.signup = signup;
exports.login = login;