const express = require('express');
const {check} = require('express-validator');

const userControllers = require('../controllers/user-controllers');

const router = express.Router();

router.post(
    '/signup', 
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ],
    userControllers.signup
);

router.post(
    '/login',
    [
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ],
    userControllers.login
);

module.exports = router;