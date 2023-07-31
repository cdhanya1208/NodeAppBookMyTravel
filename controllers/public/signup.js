const bcrypt = require('bcryptjs');
const { authenticate } = require('../../services/authentication');
const User = require('../../models/users');
const nodemailer = require('nodemailer');
const { admin } = require('../../services/firebase_authentication');
require('dotenv').config();

async function signup(name, email, password, userType){
    //Check if email and password is valid
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,50}$/;
    if (!passwordRegex.test(password)) {
      return false;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.username = name;
    user.email = email;
    user.password = hashedPassword;
    user.user_type = userType;
    await user.save();

    //Email verification using firebase
    const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name, 
        emailVerified: false, 
    });
    const verificationLink = await admin.auth().generateEmailVerificationLink(email);

    // Sending verification email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, 
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
        from: 'admin.user@yopmail.com', 
        to: email, 
        subject: 'Verify Your Email', 
        html: `
            <p>Verify your email to continue:</p>
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">Verify Email</a>
        `
    };
    await transporter.sendMail(mailOptions);

    //Authentication
    const token = authenticate(user._id, email);
    return { token: token, userId: user._id };
}

module.exports = { signup };