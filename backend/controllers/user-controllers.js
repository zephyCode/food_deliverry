const {validationResult} = require('express-validator');

const HttpError = require('../models/http-errors');
const User = require('../models/user');

const getUserProfile = async(req,res,next) => {
    const userId = req.params.userId;
    let userProfile
    try {
        userProfile = await User.findOne({_id: userId}, ['-_id']);
    }
    catch(err) {
        return next(
            new HttpError(
                'No user profile found!',
                404
            )
        );
    }
    res.status(200).json({
        user: userProfile
    });
}

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

const updateUserProfile = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError(
                'Sorry cannot process the input!',
                422
            )
        );
    }
    const userId = req.params.userId;
    let user;
    try {
        user = await User.findById(userId);
    }
    catch(err) {
        return next(
            new HttpError(
                'Cannot find the user with the id requested!',
                404
            )
        );
    }
    const {name, email, password} = req.body;
    user.name = name;
    user.email = email;
    user.password = password;
    try {
        await user.save();
    }
    catch(err) {
        return next(
            new HttpError(
                'Failed to update the user!',
                500
            )
        );
    }
    res.status(200).json({
        user: user
    });
}

exports.signup = signup;
exports.login = login;
exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;