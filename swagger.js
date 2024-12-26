// swaggerConfig.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation of all API endpoints',
    },
    servers: [
      {
        url: 'https://djumanpctbackend.onrender.com/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Indique où Swagger doit chercher les définitions des routes
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}