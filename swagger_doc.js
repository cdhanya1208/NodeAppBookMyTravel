/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API endpoints for user authentication
 *   - name: Customer 
 *     description: Functionalities of customer
 *   - name: Property Owner
 *     description: Functionalities of property owner
 *   - name: Admin 
 *     description: Functionalities of admin
 * /signup:
 *   post:
 *      summary: User Signup
 *      description: Creating new user
 *      tags: [Authentication]
 * /login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user with email and password.
 *     tags: [Authentication]
 * /viewTravelCatalogue:
 *    get:
 *      summary: View Available Properties
 *      description: List all the available properties
 *      tags: [Customer, Admin]
 * /viewAllBookings:
 *    get:
 *      summary: View the bookings 
 *      description: List the bookings details of all the customers
 *      tags: [Admin]
 * /viewMyBookings:
 *    get:
 *      summary: View bookings details
 *      description: View booking details of the logged in user
 *      tags: [Customer]
 * /bookMyTravel:
 *    post:
 *      summary: Book any available property
 *      description: Allows the logged in user to book available property
 *      tags: [Customer]
 * /cancelBooking:
 *    post:
 *      summary: Cancel any selected booking
 *      description: Both admin and user has priviledge to cancel booking
 *      tags: [Customer, Admin]
 * /addProperty:
 *    post:
 *      summary: Add property details
 *      description: Allows property owner to upload property details
 *      tags: [Property Owner]
 * /viewMyProperties:
 *   get:
 *     summary: Get the property details
 *     description: Allows property owner to see their uploaded properties
 *     tags: [Property Owner]
 * /addPermission:
 *    post:
 *      summary: Add api permissions
 *      description: Allows admin to add permissions for all the apis (user action)
 *      tags: [Admin]
 */