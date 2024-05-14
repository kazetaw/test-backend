// Import required modules
const Hapi = require('@hapi/hapi');
const userRoutes = require('./src/api/api.route')

// Initialize Hapi server
const init = async () => {
  const server = Hapi.server({
    port: 8000,
    host: 'localhost',
    routes: {
      cors: {
          origin: ['http://localhost:3000'] // Specify the origin(s) you want to allow
      }
  }
  });

  // Define routes
  server.route(userRoutes);

  // Start the server
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

// Initialize the server
init();
