const mongoose = require('mongoose');
const TravelCatalogue = require('./travel_catalogues');
const User = require('./users');

const bookingSchema = new mongoose.Schema({
    user_id: { type: String, required: true, ref: User },
    property_id: { type: String, required: true, ref: TravelCatalogue },
});

const Booking = mongoose.model('bookings', bookingSchema);
module.exports = Booking;