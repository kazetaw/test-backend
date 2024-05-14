const Boom = require("@hapi/boom");
const handler = require("./api.handler");
const utils = require("../utils/utils-common");
const { PrismaClient } = require("@prisma/client");

// Initialize Prisma Client
const prisma = new PrismaClient();
const md5 = require('md5'); // เพิ่มการนำเข้าไลบรารี md5

const helloWord = async (request, res) => {
  try {
    console.log("🚀 ~ handler: ~ request:", request);
    return "Hello World!";
  } catch (error) {
    console.log(error);
  }
};

const getParameter = async (request, res) => {
  try {
    const { id, name } = request.params;
    console.log("🚀 ~ getParameter ~ name:", name);
    console.log("🚀 ~ getParameter ~ id:", id);
    return {
      id: id,
      name: name,
    };
  } catch (error) {
    console.log(error);
  }
};

const getQueryString = async (request, res) => {
  try {
    const { id, name, firstName, lastName } = request.query;
    console.log("🚀 ~ getParameter ~ name:", name);
    console.log("🚀 ~ getParameter ~ id:", id);
    const fullName = await handler.mergeName(firstName, lastName);

    return {
      id: id,
      name: name,
      fullName: fullName,
    };
  } catch (error) {
    console.log(error);
  }
};

const getPostData = async (request, res) => {
  try {
    const { data } = request.payload;
    const { id, name, profile } = data;
    console.log("🚀 ~ getParameter ~ name:", name);
    console.log("🚀 ~ getParameter ~ id:", id);
    const fullName = handler.mergeName(
      profile.firstName,
      profile.lastName,
      profile.birthDate
    );

    const date = utils.convertStrToDate(profile.birthDate);
    console.log("🚀 ~ getPostData ~ date:", date);
    return {
      id: id,
      name: name,
      profile: profile,
      fullName: fullName,
      birthDate: date,
    };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation(error);
  }
};

const getConnectDB = async (request, res) => {
  try {
    const getUser = await prisma.Users.findFirst({
      where: {
        id: 1,
      },
    });
    const getUserAll = await prisma.Users.findMany({});
    console.log("🚀 ~ getConnectDB ~ getUserAll:", getUserAll);
    return {
      statusCode: 200,
      result: {
        getUserAll,
        getUser,
      },
    };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation(error);
  }
};

const userLogin = async (request, h) => {
  try {
    const { username, password } = request.payload;
    const hashedPassword = md5(password); // Hash the password using MD5

    // Find the user with the provided username and check if the password matches
    const user = await prisma.user.findFirst({
      where: {
        login: {
          username,
          password: hashedPassword,
        },
      },
      include: {
        login: true,
      },
    });

    if (!user) {
      // return h.response({ error: 'Invalid credentials' }).code(401);
      return {
        statusCode: 400,
        result: {
          user
        },
      };
    }

    // Return the user information or generate a token for authentication
    // return h.response({ message: 'Login successful', user });
    return {
      statusCode: 200,
      result: {
        user
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};

const getUsers = async (request, response) => {
  try {
    const { username, password } = request.payload;

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return Boom.badRequest('Username already exists');
    }
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password
      }
    });

    return { message: 'User registered successfully', user: newUser };
  } catch (error) {
    console.error('Error:', error);
    return Boom.badImplementation('Internal server error');
  }
};

const createSinglePage = async (request, h) => {
  try {
    const { title, content, typeId, titleImages, pageLink, isActive } = request.payload;

    const newSinglePage = await prisma.singlePage.create({
      data: {
        title,
        content,
        typeId,
        titleImages,
        pageLink,
        isActive,
      },
    });

    return h.response({ message: 'Single page created successfully', data: newSinglePage }).code(201);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const getSinglePageById = async (request, h) => {
  try {
    const singlePages = await prisma.singlePage.findMany({
      include: {
        type: true, // Include the related PageType
      },
    });

    return h.response({ data: singlePages });
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};

const updateSinglePageById = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, content, typeId, titleImages, pageLink, isActive } = request.payload;

    // Check if the SinglePage record exists
    const existingSinglePage = await prisma.singlePage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSinglePage) {
      return h.response({ error: 'Single page not found' }).code(404);
    }

    const updatedSinglePage = await prisma.singlePage.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        typeId,
        titleImages,
        pageLink,
        isActive,
      },
    });

    return h.response({ message: 'Single page updated successfully', data: updatedSinglePage });
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};


const deleteSinglePageById = async (request, h) => {
  try {
    const { id } = request.params;

    const deletedSinglePage = await prisma.singlePage.delete({
      where: { id: parseInt(id) },
    });

    if (!deletedSinglePage) {
      return h.response({ error: 'Single page not found' }).code(404);
    }

    return h.response({ message: 'Single page deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const createPageType = async (request, h) => {
  try {
    const { typeName } = request.payload;

    const newPageType = await prisma.pageType.create({
      data: {
        typeName
      }
    });

    return h.response({ message: 'PageType created successfully', data: newPageType }).code(201);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const getPageTypeById = async (request, h) => {
  try {
    const { id } = request.params;

    const pageType = await prisma.pageType.findUnique({
      where: { id: parseInt(id) }
    });

    if (!pageType) {
      return h.response('PageType not found').code(404);
    }

    return h.response(pageType).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const updatePageTypeById = async (request, h) => {
  try {
    const { id } = request.params;
    const { typeName } = request.payload;

    const updatedPageType = await prisma.pageType.update({
      where: { id: parseInt(id) },
      data: {
        typeName
      }
    });

    return h.response({ message: 'PageType updated successfully', data: updatedPageType }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const deletePageTypeById = async (request, h) => {
  try {
    const { id } = request.params;

    await prisma.pageType.delete({
      where: { id: parseInt(id) }
    });

    return h.response({ message: 'PageType deleted successfully' }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const createTag = async (request, h) => {
  try {
    const { tagName } = request.payload;

    const newTag = await prisma.tag.create({
      data: {
        tagName
      }
    });

    return h.response({ message: 'Tag created successfully', data: newTag }).code(201);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const getTagById = async (request, h) => {
  try {
    const { id } = request.params;

    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) }
    });

    if (!tag) {
      return h.response('Tag not found').code(404);
    }

    return h.response(tag).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const updateTagById = async (request, h) => {
  try {
    const { id } = request.params;
    const { tagName } = request.payload;

    const updatedTag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        tagName
      }
    });

    return h.response({ message: 'Tag updated successfully', data: updatedTag }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const deleteTagById = async (request, h) => {
  try {
    const { id } = request.params;

    await prisma.tag.delete({
      where: { id: parseInt(id) }
    });

    return h.response({ message: 'Tag deleted successfully' }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const userRegister = async (request, h) => {
  try {
    const { firstName, lastName, email, username, password } = request.payload;
    const hashedPassword = md5(password); // เข้ารหัสรหัสผ่านเป็น MD5

    // Check if the email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return h.response({ error: 'Email already exists' }).code(400);
    }

    // Create new user with login information
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        login: {
          create: {
            username,
            password: hashedPassword // ใช้รหัสผ่านที่เข้ารหัส MD5
          }
        }
      },
      include: {
        login: true
      }
    });

    return h.response({ message: 'User registered successfully', user: newUser }).code(201);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const getAllUsers = async (request, h) => {
  try {
    const users = await prisma.user.findMany();
    return h.response({ users }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const getUserById = async (request, h) => {
  try {
    const { id } = request.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!user) {
      return h.response({ error: 'User not found' }).code(404);
    }

    return h.response({ user }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const updateUser = async (request, h) => {
  try {
    const { id } = request.params;
    const { firstName, lastName, email, username } = request.payload;

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        firstName,
        lastName,
        email,
        login: {
          update: {
            username
          }
        }
      },
      include: {
        login: true
      }
    });

    return h.response({ message: 'User updated successfully', user: updatedUser }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const deleteUser = async (request, h) => {
  try {
    const { id } = request.params;

    const deletedUser = await prisma.user.delete({
      where: {
        id: parseInt(id)
      }
    });

    return h.response({ message: 'User deleted successfully', user: deletedUser }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const createSinglePages = async (request, h) => {
  try {
    const { title, content, typeId, titleImages, pageLink, isActive } = request.payload;

    // Check if the provided typeId exists in the PageType table
    const existingPageType = await prisma.pageType.findUnique({
      where: { id: typeId },
    });

    if (!existingPageType) {
      return h.response({ error: 'Invalid typeId. PageType not found.' }).code(400);
    }

    const newSinglePage = await prisma.singlePage.create({
      data: {
        title,
        content,
        typeId,
        titleImages,
        pageLink,
        isActive,
        timestampCreate: new Date(),
      },
    });

    return h.response({ message: 'Single page created successfully', data: newSinglePage }).code(201);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const createManageMenu = async (request, h) => {
  try {
    const { menuName, path, isActive, parentId,icons } = request.payload;

    const newManageMenu = await prisma.manageMenu.create({
      data: {
        menuName,
        path,
        isActive,
        parentId,
        icons,
      },
    });

    return h.response({ message: 'Manage menu created successfully', data: newManageMenu }).code(201);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const updateManageMenu = async (request, h) => {
  try {
    const { id } = request.params;
    const { menuName, path, isActive, parentId,icons } = request.payload;

    const updatedManageMenu = await prisma.manageMenu.update({
      where: { id: parseInt(id) },
      data: {
        menuName,
        path,
        isActive,
        parentId,
        icons,
      },
    });

    if (!updatedManageMenu) {
      return h.response({ error: 'Manage menu not found' }).code(404);
    }

    return h.response({ message: 'Manage menu updated successfully', data: updatedManageMenu });
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const deleteManageMenu = async (request, h) => {
  try {
    const { id } = request.params;

    const deletedManageMenu = await prisma.manageMenu.delete({
      where: { id: parseInt(id) },
    });

    if (!deletedManageMenu) {
      return h.response({ error: 'Manage menu not found' }).code(404);
    }

    return h.response({ message: 'Manage menu deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};

const getManageMenuById = async (request, h) => {
  try {
    const { id } = request.params;
    const manageMenu = await prisma.manageMenu.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!manageMenu) {
      return h.response({ error: 'Manage menu not found' }).code(404);
    }

    return h.response({ manageMenu }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};
const getAllManageMenus = async (request, h) => {
  try {
    const manageMenus = await prisma.manageMenu.findMany();
    return h.response({ manageMenus }).code(200);
  } catch (error) {
    console.error('Error:', error);
    return h.response('Internal server error').code(500);
  }
};


module.exports = {
  createManageMenu,
  updateManageMenu,
  deleteManageMenu,
  getManageMenuById,
  getAllManageMenus,
  helloWord,
  getParameter,
  getQueryString,
  getPostData,
  getConnectDB,
  userLogin,
  getUsers,
  userRegister,
  createSinglePage,
  getSinglePageById,
  updateSinglePageById,
  deleteSinglePageById,
  createPageType,
  createSinglePages,
  getPageTypeById,
  deletePageTypeById,
  updatePageTypeById,
  createTag,
  getTagById,
  updateTagById,
  deleteTagById,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
