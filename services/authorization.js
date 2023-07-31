const jwt = require('jsonwebtoken');
const User = require('../models/users')
const Permission = require('../models/permissions');
const { checkIfEmailIsVerified } = require('./firebase_authentication');
require('dotenv').config();

async function authorize(req, res, next) {
    //Get the user token from the cookie and add it to authorization headers
    const token = req.cookies.token;
    if (token) {
        req.headers['Authorization'] = `Bearer ${token}`;
    }
    const secretKey = process.env.JWT_SECRET_KEY; 
    const decodedToken = jwt.verify(req.headers['Authorization'].substring(7), secretKey);
    const userType = await User.findById(decodedToken.userId).select({user_type: 1, _id: 0});
    const allowedUserTypes = await Permission.findOne({action: req.url.slice(1)}).select({user_types: 1, _id: 0});

    if (allowedUserTypes.user_types.includes(userType.user_type)) {
        //Check if the email is verified
        if (!await checkIfEmailIsVerified(decodedToken.email)) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        req.user_id = decodedToken.userId;
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = { authorize };