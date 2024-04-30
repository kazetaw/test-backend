'use strict';

const Hapi = require('@hapi/hapi');
const userRoutes = require('./src/api/api.route');
const init = async () => {

    const server = Hapi.server({
        port: 8000,
        host: 'localhost'
    });

    server.route(userRoutes);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();