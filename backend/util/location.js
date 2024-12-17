const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/get-location', async(req,res,next) => {
    const options = {
        method: "GET",
        url: "https://api.ipstack.com/134.201.250.155?access_key=5db403c5202a7bb87347f2958cc5432f",
    };
    
    try {
        const response = await axios.request(options);
        res.status(201).json({
            location: {
                city: response.data.city,
                zip: response.data.zip,
                region: response.data.region_name
            }
        });
    } 
    catch (error) {
        console.error(error);
    }
    res.status(201);
});

module.exports = router;
