const User = require("../../models/users");
const bcrypt = require('bcryptjs');
const { authenticate } = require('../../services/authentication')

async function login(email, password) {
    const user = await User.findOne({email: email});
    if (!user) {
        return false;
    }
    
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        return false;
    }
    //Authentication
    const token = authenticate(user._id, email);
    return token;
}

module.exports = { login };