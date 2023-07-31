const mongoose = require('mongoose');

async function connectDB() {
    mongoose.connect('mongodb+srv://dhanya:Dhanya@cluster0.qbclhfb.mongodb.net/book_my_travel?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB successfully!');
    });
}

module.exports = { connectDB };