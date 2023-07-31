const bcrypt = require('bcryptjs');
const { authenticate } = require('../../services/authentication');
const User = require('../../models/users');
const nodemailer = require('nodemailer');
const { admin } = require('../../services/firebase_authentication');

async function signup(name, email, password, userType){
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
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: 'cdhanya1208@gmail.com',
        pass: 'huaszyshattgpzwx',
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