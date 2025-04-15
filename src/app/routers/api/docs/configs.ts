// import Schemas from './schemas';

export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'API Documentation',
      contact: {
        name: 'Hafis Alrizal',
        url: 'https://hafisalrizal.com',
        email: 'hafisalrizal@gmail.com'
      }
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    schemes: ['http', 'https'],
    components: {
      // schemas: Schemas
    }
  },
  apis: ['./src/entities/**/*.ts']
};
