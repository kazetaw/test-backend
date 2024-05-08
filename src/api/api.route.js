const API = require("./api.controller");

const userRoutes = [
  {
    method: "GET",
    path: "/parameter/{id}/{name}",
    handler: API.getParameter,
  },
  {
    method: "GET",
    path: "/query",
    handler: API.getQueryString,
  },
  {
    method: "GET",
    path: "/",
    handler: API.helloWord,
  },
  {
    method: "POST",
    path: "/post",
    handler: API.getPostData,
  },
  {
    method: "POST",
    path: "/connect-db",
    handler: API.getConnectDB,
  },
  {
    method: "POST",
    path: "/login",
    handler: API.userLogin,
  },
  {
    method: "POST",
    path: "/logins",
    handler: API.getUsers,
  },
  {
    method: "POST",
    path: "/register",
    handler: API.userRegister,
  },
  {
    method: "GET",
    path: "/singlepage/{id}",
    handler: API.getSinglePageById,
  },
  {
    method: "POST",
    path: "/singlepage",
    handler: API.createSinglePage,
  },
  {
    method: "PUT",
    path: "/singlepage/{id}",
    handler: API.updateSinglePageById
  },
  {
    method: "DELETE",
    path: "/singlepage/{id}",
    handler: API.deleteSinglePageById,
  },
  {
    method: "PUT",
    path: "/pagetype/{id}",
    handler: API.updatePageTypeById,
  },
  {
    method: "POST",
    path: "/pagetype",
    handler: API.createPageType,
  },
  
];

module.exports = userRoutes;
