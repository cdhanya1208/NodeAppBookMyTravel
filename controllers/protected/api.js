const Booking = require('../../models/bookings');
const Permission = require('../../models/permissions');
const PropertyImage = require('../../models/property_images');
const TravelCatalogue = require('../../models/travel_catalogues');
const User = require('../../models/users');

async function addPermissions(action, userType) {
    const permission = await Permission.findOne({action: action});
    if (!permission) {
        const permission = new Permission();
        permission.action = action;
        permission.user_types = [userType];
        await permission.save();
    } else {
        let userTypes = permission.user_types;
        userTypes.push(userType);
        permission.user_types = userTypes;
        await permission.save();
    }
    return true;
}

async function viewTravelCatalog() {
    const travelCatalogues =  await TravelCatalogue.find();
    if (travelCatalogues.length == 0) {
        return [];
    }
    let allTravelDetails = [];
    for (const property of travelCatalogues) {
      let details = { property_id: property._id, place: property.place, price: property.price};
      if (property.is_booked) {
        details['availability_status'] = 'Not Available';
      } else {
        details['availability_status'] = 'Available';
      }
     
      const propertyImages = await PropertyImage.count({property_id: property.id});
      details['images'] = propertyImages;
      allTravelDetails.push(details);
    }

    return allTravelDetails;

}

async function postMyProperty(userId, propertyPlace, propertyImages, propertyPrice) {

  const travelCatalogue = new TravelCatalogue();
  travelCatalogue.place = propertyPlace;
  travelCatalogue.price = propertyPrice;
  travelCatalogue.is_booked = false;
  travelCatalogue.owner_id = userId;
  await travelCatalogue.save();
  
  for (const image of propertyImages) {
    const propertyImage = new PropertyImage();
    propertyImage.property_id = travelCatalogue.id;
    propertyImage.imageBuffer = image.imageBuffer;
    propertyImage.contentType = image.contentType;
    await propertyImage.save();
  }
}

async function viewMyProperties(userId) {
    const properties = await TravelCatalogue.find({owner_id: userId});
    if (properties.length == 0) {
        return false;
    } 
    let details = [];
    for (const property of properties) {
        details.push({place: property.place, price: property.price, isBooked: property.is_booked})
    }
    return details;
}

async function bookMyTravel(propertyId, userId) {
    const property = await TravelCatalogue.findById(propertyId);
    if (!property || property.is_booked) {
        return false;
    }
    
    const booking = new Booking();
    booking.property_id = propertyId;
    booking.user_id = userId;
    await booking.save();
    
    //change the availability status of the property
    property.is_booked = true;
    await property.save();

    return true;
}

async function viewMyBookings(userId) {
    const myBookings = await Booking.find({user_id: userId}).populate('property_id');
    if (myBookings.length == 0) {
        return false;
    }
    let details = [];
    for (const myBooking of myBookings) {
        if (myBooking.property_id.is_booked) {
            details.push({ 
                booking_id: myBooking._id, 
                place: myBooking.property_id.place, 
                price: myBooking.property_id.price
            });
        }
    }
    return details;
}

async function viewAllBookings() {
    const allBookings = await Booking.find().populate('property_id').populate('user_id');
    if (allBookings.length == 0) {
        return false;
    }
    let details = [];
    for (const booking of allBookings) {
        if (booking.property_id.is_booked) {
            details.push({
                customer_name: booking.user_id.username, 
                booking_id: booking._id, 
                place: booking.property_id.place, 
                price: booking.property_id.price
            });
        }
    }
    return details;

}

async function cancelBooking(bookingId, userId) {
     
     const user = await User.findById(userId);
     
     let booking;
     if (user.user_type == 'admin') {
        booking = await Booking.findById(bookingId);
     } else {
        booking = await Booking.findOne({_id: bookingId, user_id: userId});
     }
     if (!booking) {
        return false;
     }
     const propertyId = booking.property_id;
     await booking.deleteOne();
     await TravelCatalogue.findByIdAndUpdate(propertyId, {is_booked: false});
     return true;
}

module.exports = { 
    viewTravelCatalog, 
    postMyProperty, 
    bookMyTravel, 
    viewMyBookings, 
    viewAllBookings, 
    cancelBooking, 
    viewMyProperties,
    addPermissions 
};