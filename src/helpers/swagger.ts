import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';

export function setupSwagger(app: Application) {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Gamemaker API',
      version: '0.0.1',
    },
    servers: [
      {
        url: 'http://localhost:3000/', // Update with your API server URL
      },
    ],
    components: {
      securitySchemes: {
        JWT: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
  };

  const options = {
    swaggerDefinition,
    apis: ['./src/routers/*.ts'], // Specify the path to your API files (modify this as per your project structure)
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
