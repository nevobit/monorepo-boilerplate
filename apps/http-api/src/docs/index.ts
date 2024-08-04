export const swaggerOptions = {
    routePrefix: '/documentation',
    exposeRoute: true,
    swagger: {
      info: {
        title: '@repo',
        description: 'API Documentation',
        version: '1.0.0'
      },
      tags: [
        { name: 'Authentication', description: 'Endpoints de autenticación' }
      ],
      paths: {
        // ...authRoutes
      },
      components: {
        // schemas: schemas
      }
    }
};

export const swaggerUiOptions = {
    routePrefix: "api/v1/docs",
    exposeRoute: true,
  };

  