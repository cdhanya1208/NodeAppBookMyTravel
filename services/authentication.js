const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(userId, email) {
    const secretKey = process.env.JWT_SECRET_KEY; 
    const payload = {
        userId: userId,
        email: email,
    };

    //Setting token expiry to 5 minutes
    const options = {
        expiresIn: '5m', 
    };

    // Generate the JWT token
    const token = jwt.sign(payload, secretKey, options);

    console.log('JWT Token:', token);
    return token;

}

module.exports = { authenticate };