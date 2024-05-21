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
    path: "/register",
    handler: API.userRegister,
  },
  {
    method: "GET",
    path: "/users",
    handler: API.getAllUsers
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: API.getUserById
  },
  {
    method: "POST",
    path: "/users/{id}",
    handler: API.updateUser 
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    handler: API.deleteUser 
  },
  {
    method: "GET",
    path: "/singlepage/{id}",
    handler: API.getSinglePageById,
  },
  {
    method: "POST",
    path: "/singlepage/{id}",
    handler: API.updateSinglePageById
  },
  {
    method: "POST",
    path: "/singlepage",
    handler: API.createSinglePages
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
  {
    method: "GET",
    path: "/pagetype/{id}",
    handler: API.getPageTypeById,
  },
  {
    method: "POST",
    path: "/pagetype/{id}",
    handler: API.updatePageTypeById,
  },
  {
    method: "DELETE",
    path: "/pagetype/{id}",
    handler: API.deletePageTypeById,
  },
  {
    method: "POST",
    path: "/tag",
    handler: API.createTag,
  },
  {
    method: "GET",
    path: "/tag/{id}",
    handler: API.getTagById,
  },
  {
    method: "POST",
    path: "/tag/{id}",
    handler: API.updateTagById,
  },
  {
    method: "POST",
    path: "/manage-menu",
    handler: API.createManageMenu,
  },
  {
    method: "POST",
    path: "/manage-menu/{id}",
    handler: API.updateManageMenu,
  },
  {
    method: "DELETE",
    path: "/manage-menu/{id}",
    handler: API.deleteManageMenu,
  },
  {
    method: "GET",
    path: "/manage-menu/{id}",
    handler: API.getManageMenuById,
  },
  {
    method: "GET",
    path: "/manage-menu",
    handler: API.getAllManageMenus,
  },
  {
    method: "DELETE",
    path: "/tag/{id}",
    handler: API.deleteTagById,
  },
<<<<<<< HEAD

  {
    method: 'POST',
    path: '/upload',
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 5048576,
      }
    },
    handler: API.uploadFiles
  },
  {
    method: 'GET',
    path: '/uploads',
    handler: API.getAllFiles
  },
  {
    method: 'GET',
    path: '/uploads/{filename}',
    handler: API.getFiles
  }
=======
>>>>>>> f2178cd11ee31cb437757166ca852b584d0958d8
];

module.exports = userRoutes;
