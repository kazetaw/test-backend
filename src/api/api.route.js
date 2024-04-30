const API = require('./api.controller')

const userRoutes = [
    {
        method: 'GET',
        path: '/',
        handler: API.helloWord
    },
    {
        method: 'GET',
        path: '/parameter/{id}/{name}',
        handler: API.getParameter
    },
    {
        method: 'GET',
        path: '/query',
        handler: API.getQueryString
    },
    {
        method: 'POST',
        path: '/post',
        handler: API.getPostData
    },
];

module.exports = userRoutes;