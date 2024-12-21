const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const userRoutes = require('./routes/user-routes');
const orderRoutes = require('./routes/order-routes');
const location = require('./util/location');


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/order/new', orderRoutes);
app.use('/api/user', location);

app.use((req, res, next) => {
    res.json({ message: 'No such route found!' });
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!' });
});


app.listen(5000, () => {
    console.log("Listening...");
    console.log('http://localhost:5000');
});

mongoose.connect(
    'mongodb+srv://utkarsh:5TeDbEJiNZFWFo08@cluster0.udiqf.mongodb.net/food_delivery_db?retryWrites=true&w=majority&appName=Cluster0'
).then(() => {
    console.log('connected to the database');
}).catch(() => {
    console.log('not connected to the database!');
});