const express = require('express');
const router = express.Router();

const orderControllers = require('../controllers/order-controllers');

router.post('/:uid', orderControllers.placeOrder);

module.exports = router;