const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticate(userId, email) {
    const secretKey = process.env.JWT_SECRET_KEY; 
    const payload = {
        userId: userId,
        email: email,
    };

    //Options for the token (optional)
    // const options = {
    //     expiresIn: '1h', // Token expiration time (e.g., 1 hour)
    // };

    // Generate the JWT token
    const token = jwt.sign(payload, secretKey);

    console.log('JWT Token:', token);
    return token;

}

module.exports = { authenticate };