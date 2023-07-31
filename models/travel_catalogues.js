const mongoose = require('mongoose');
const User = require('./users');

const travelSchema = new mongoose.Schema({
  owner_id: { type: String, required: true, ref: User },
  place: { type: String, required: true },
  price: { type: Number, required: true },
  is_booked: { type: Boolean, required: true },
})

const TravelCatalogue = mongoose.model('travel_catalogues', travelSchema);

module.exports = TravelCatalogue;