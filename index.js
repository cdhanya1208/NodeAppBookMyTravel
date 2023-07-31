const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = require('./swagger');
const { signup } = require('./controllers/public/signup');
const app = express();
const { connectDB } = require('./db');
const Booking = require('./models/bookings');
const { viewTravelCatalog, postMyProperty, viewMyBookings, viewAllBookings, cancelBooking, addPermissions, bookMyTravel } = require('./controllers/protected/api');
const PropertyImage = require('./models/property_images');
const multer = require('multer');
const { authorize } = require('./services/authorization');
const { login } = require('./controllers/public/login');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cookieParser = require('cookie-parser');

//Swagger configuration
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {  
  const response = await signup(req.body.username, req.body.email, req.body.password, req.body.user_type);
  //Clearing the existing session
  res.clearCookie('token');
  //Setting jwt token in a cookie to use it in subsequent requests
  res.cookie('token', response.token, { httpOnly: true, maxAge: 3600000 }); 
  res.json({ token: response.token });
});

app.post('/login', async (req, res) => {
  const token = await login(req.body.email, req.body.password);
  if (!token) {
    res.json({error: 'Invalid email or password'});
    return;
  }
  //Clearing the existing session
  res.clearCookie('token');
  //Setting jwt token in a cookie to use it in subsequent requests
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 
  res.json({ token: token });
});

app.get('/viewTravelCatalogue', authorize, async (req, res, next) => {
    const travelCatalogues = await viewTravelCatalog();
    if (!travelCatalogues) {
      res.json({response: 'No property found'});
      return;
    }
    res.json({details: travelCatalogues});
})

app.post('/viewMyBookings', authorize, async (req, res) => {
    const bookings = await viewMyBookings(req.user_id);
    if (!bookings) {
      res.json({response: 'Currently you dont have any bookings'});
      return;
    }
    res.json({bookings: bookings});
})

app.post('/bookMyTravel', authorize, async (req, res) => {
  if (!await bookMyTravel(req.body.property_id, req.user_id)) {
      res.json('Unable to book');
      return;
  } 
  res.json({success: 'Travel Booked Successfully'});
})

app.get('/viewAllBookings', authorize, async (req, res) => {
    const allBookings = await viewAllBookings();
    if (!allBookings) {
      res.json({response: 'No current bookings found'});
      return;
    }
    res.json({allBookings: allBookings})
})

app.post('/cancelBooking', authorize, async (req, res) => {
    if (!await cancelBooking(req.body.booking_id, req.user_id)) {
      res.json({error: 'Cannot able to cancel booking'});
      return;
    }
    res.json({success: 'Booking cancelled successfully'});
})
app.post('/addProperty', authorize, upload.array('images', 3), async (req, res) => {
    const images = req.files.map((file) => ({
      imageBuffer: file.buffer,
      contentType: file.mimetype,
    }));
    await postMyProperty(req.user_id, req.body.place, images, req.body.price);
    res.json({success: 'Your property uploaded successfully'});
})

app.post('/addPermissions', authorize, async (req, res) => {
    if (!await addPermissions(req.body.action, req.body.user_type)) {
       res.json({error: 'Unable to add permission'});
       return;
    } else {
        res.json({success: 'Permission updated successfully'});
    }
})

// Start the server and connect to MongoDB
const port = 3000;
connectDB().then(() => {
    app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  })
});

