const express = require('express');
const {check} = require('express-validator');

const userControllers = require('../controllers/user-controllers');

const router = express.Router();

router.get('/:userId', userControllers.getUserProfile);

router.post(
    '/auth/signup', 
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ],
    userControllers.signup
);

router.post(
    '/auth/login',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ],
    userControllers.login
);

router.post(
    '/update/profile/:userId',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ],
    userControllers.updateUserProfile
)

module.exports = router;