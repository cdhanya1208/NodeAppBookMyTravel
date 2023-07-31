const swaggerDefinition = {
    openapi: '3.0.0', 
    info: {
      title: 'BookMyTravel API', 
      version: '1.0.0', 
      description: 'Documentation for BookMyTravel Application', 
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Local server', 
      },
    ],
  };
  
  const swaggerJsDoc = require('swagger-jsdoc');
  const swaggerOptions = {
    swaggerDefinition,
    apis: ['./swagger_doc.js'], 
  };
  
  module.exports = swaggerOptions;
  