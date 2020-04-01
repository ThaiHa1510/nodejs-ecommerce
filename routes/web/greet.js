// greet.js
const express = require('express');
module.exports = function(options = {}) { // Router factory
 const router = express.Router();
 // Get controller
 const {service} = options.servire;
 router.get('/greet', (req, res, next) => {
     console.log(options.servire.greeting);
 res.end(
    options.servire.setGreeting('thaiha')
 );
 });
 return router;
};