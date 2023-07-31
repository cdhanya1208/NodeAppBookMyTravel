const mongoose = require('mongoose');
const TravelCatalogue = require('./travel_catalogues');

const propertyImageSchema = new mongoose.Schema({
    property_id: { type: String, required: true, ref: TravelCatalogue },
    imageBuffer: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  });
  
  const PropertyImage = mongoose.model('property_images', propertyImageSchema);
  
  module.exports = PropertyImage;