const fs = require("fs");
const Boom = require("@hapi/boom");
const handler = require("./api.handler");
const utils = require("../utils/utils-common");
const { PrismaClient } = require("@prisma/client");

// Initialize Prisma Client
const prisma = new PrismaClient();
const md5 = require("md5"); // เพิ่มการนำเข้าไลบรารี md5

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
          user,
        },
      };
    }

    // Return the user information or generate a token for authentication
    // return h.response({ message: 'Login successful', user });
    return {
      statusCode: 200,
      result: {
        user,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getUsers = async (request, res) => {
  try {
    const { username, password } = request.payload;

    // Check if the username already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return {
        statusCode: 400,
        error: "Username already exists",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password,
      },
    });

    return {
      statusCode: 201,
      result: {
        message: "User registered successfully",
        user: newUser,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const createSinglePage = async (request, h) => {
  try {
    const { title, content, typeId, titleImages, pageLink, isActive, tags } =
      request.payload;

    const newSinglePage = await prisma.singlePage.create({
      data: {
        title,
        content,
        typeId,
        titleImages,
        pageLink,
        isActive,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { tagName: tag.tagName },
            create: { tagName: tag.tagName },
          })),
        },
      },
    });
    console.log("🚀 ~ createSinglePage ~ newSinglePage:", newSinglePage);

    return h
      .response({
        statusCode: 201,
        result: {
          message: "Single page created successfully",
          data: newSinglePage,
        },
      })
      .code(201);
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getAllSinglePages = async (request, h) => {
  try {
    const singlePage = await prisma.singlePage.findMany({
      include: {
        type: true, // Include the related PageType
      },
    });
    return {
      statusCode: 200,
      result: {
        singlePage,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getSinglePageById = async (request, h) => {
  try {
    const { id } = request.params;
    const singlePage = await prisma.singlePage.findUnique({
      where: { id: parseInt(id) },
      include: {
        type: true, // Include the related PageType
      },
    });

    if (!singlePage) {
      return h.response({ error: "Single page not found" }).code(404);
    }

    return h.response({ data: singlePage });
  } catch (error) {
    console.error("Error:", error);
    return h.response("Internal server error").code(500);
  }
};

const updateSinglePageById = async (request, res) => {
  try {
    const { id } = request.params;
    const { title, content, typeId, titleImages, pageLink, isActive } =
      request.payload;

    // Check if the SinglePage record exists
    const existingSinglePage = await prisma.singlePage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingSinglePage) {
      return {
        statusCode: 404,
        error: "Single page not found",
      };
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

    return {
      statusCode: 200,
      result: {
        message: "Single page updated successfully",
        data: updatedSinglePage,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const deleteSinglePageById = async (request, res) => {
  try {
    const { id } = request.params;

    const deletedSinglePage = await prisma.singlePage.delete({
      where: { id: parseInt(id) },
    });

    if (!deletedSinglePage) {
      return {
        statusCode: 404,
        error: "Single page not found",
      };
    }

    return {
      statusCode: 200,
      result: {
        message: "Single page deleted successfully",
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const createPageType = async (request, res) => {
  try {
    const { typeName } = request.payload;

    const newPageType = await prisma.pageType.create({
      data: {
        typeName,
      },
    });
    console.log("🚀 ~ createPageType ~ newPageType:", newPageType);

    return {
      statusCode: 201,
      result: {
        message: "PageType created successfully",
        data: newPageType,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getPageTypeById = async (request, res) => {
  const { id } = request.params; // Assuming the ID is passed as a parameter in the request

  try {
    const pageType = await prisma.pageType.findUnique({
      where: { id: parseInt(id) }, // Parse the ID to ensure it's a number
    });

    if (!pageType) {
      return Boom.notFound("Page type not found");
    }

    return {
      statusCode: 200,
      result: pageType,
    };
  } catch (error) {
    console.error("Error:", error);
    throw Boom.badImplementation(error);
  }
};
const updatePageTypeById = async (request, res) => {
  try {
    const { id } = request.params;
    const { typeName } = request.payload;

    const updatedPageType = await prisma.pageType.update({
      where: { id: parseInt(id) },
      data: {
        typeName,
      },
    });

    return {
      statusCode: 200,
      result: {
        message: "PageType updated successfully",
        data: updatedPageType,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const deletePageTypeById = async (request, res) => {
  try {
    const { id } = request.params;

    await prisma.pageType.delete({
      where: { id: parseInt(id) },
    });

    return {
      statusCode: 200,
      result: {
        message: "PageType deleted successfully",
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const createTag = async (request, res) => {
  try {
    const { tagName } = request.payload;

    const newTag = await prisma.tag.create({
      data: {
        tagName,
      },
    });

    return {
      statusCode: 201,
      result: {
        message: "Tag created successfully",
        data: newTag,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getTagById = async (request, res) => {
  try {
    const { id } = request.params;

    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tag) {
      return {
        statusCode: 404,
        error: "Tag not found",
      };
    }

    return {
      statusCode: 200,
      result: tag,
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const updateTagById = async (request, res) => {
  try {
    const { id } = request.params;
    const { tagName } = request.payload;

    const updatedTag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        tagName,
      },
    });

    return {
      statusCode: 200,
      result: {
        message: "Tag updated successfully",
        data: updatedTag,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const deleteTagById = async (request, res) => {
  try {
    const { id } = request.params;

    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });

    return {
      statusCode: 200,
      result: {
        message: "Tag deleted successfully",
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const userRegister = async (request, res) => {
  try {
    const { firstName, lastName, email, username, password } = request.payload;
    const hashedPassword = md5(password); // Hash the password using MD5

    // Check if the email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return {
        statusCode: 400,
        error: "Email already exists",
      };
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
            password: hashedPassword, // Use the hashed password
          },
        },
      },
      include: {
        login: true,
      },
    });

    return {
      statusCode: 201,
      result: {
        message: "User registered successfully",
        user: newUser,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getAllUsers = async (request, res) => {
  try {
    const users = await prisma.user.findMany();
    return {
      statusCode: 200,
      result: {
        users,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getUserById = async (request, res) => {
  try {
    const { id } = request.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return {
        statusCode: 404,
        error: "User not found",
      };
    }

    return {
      statusCode: 200,
      result: {
        user,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const updateUser = async (request, res) => {
  try {
    const { id } = request.params;
    const { firstName, lastName, email, username } = request.payload;

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        firstName,
        lastName,
        email,
        login: {
          update: {
            username,
          },
        },
      },
      include: {
        login: true,
      },
    });

    return {
      statusCode: 200,
      result: {
        message: "User updated successfully",
        user: updatedUser,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const deleteUser = async (request, res) => {
  try {
    const { id } = request.params;

    const deletedUser = await prisma.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      statusCode: 200,
      result: {
        message: "User deleted successfully",
        user: deletedUser,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const createSinglePages = async (request, h) => {
  const { title, content, typeId, titleImages, isActive, tag } = request.payload;

  try {
    // Create the single page
    const newSinglePage = await prisma.singlePage.create({
      data: {
        title,
        content,
        typeId,
        titleImages,
        pageLink: "", // Temporary value, will be updated below
        isActive,
        timestampCreate: new Date(),
        tag: tag || null, // Ensure tag is either provided or set to null
      },
    });

    // Update the pageLink with the new ID
    const updatedSinglePage = await prisma.singlePage.update({
      where: { id: newSinglePage.id },
      data: { pageLink: `/public/ui-components/content/${newSinglePage.id}` },
    });

    // Fetch the typeName based on typeId
    const typeData = await prisma.pageType.findUnique({
      where: { id: typeId },
      select: { typeName: true }, // Select only the typeName field
    });

    const typeName = typeData?.typeName || "ไม่มีประเภท"; // Default if typeName not found

    console.log("🚀 ~ createSinglePages ~ updatedSinglePage:", updatedSinglePage);

    return h.response({
      statusCode: 201,
      result: {
        message: "Single page created successfully",
        data: { ...updatedSinglePage, typeName }, // Include typeName in the response data
      },
    }).code(201);

  } catch (error) {
    console.error("Error creating single page:", error);

    // Check if the error is a Prisma error and log specific details
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error meta:", error.meta);
    }

    return Boom.badImplementation("An internal server error occurred");
  }
};


const createManageMenu = async (request, h) => {
  try {
    const { menuName, pathMenu, isActive, parentId, icons } = request.payload;

    const newManageMenu = await prisma.manageMenu.create({
      data: {
        menuName,
        pathMenu: pathMenu || null,
        isActive,
        parentId,
        icons: icons || null,
      },
    });

    return {
      statusCode: 201,
      result: {
        message: "Manage menu created successfully",
        data: newManageMenu,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const updateManageMenu = async (request, res) => {
  try {
    const { id } = request.params;
    const { menuName, pathMenu, isActive, parentId, icons } = request.payload;

    const updatedManageMenu = await prisma.manageMenu.update({
      where: { id: parseInt(id) },
      data: {
        menuName,
        pathMenu,
        isActive,
        parentId,
        icons,
      },
    });

    if (!updatedManageMenu) {
      return {
        statusCode: 404,
        error: "Manage menu not found",
      };
    }

    return {
      statusCode: 200,
      result: {
        message: "Manage menu updated successfully",
        data: updatedManageMenu,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const deleteManageMenu = async (request, res) => {
  try {
    const { id } = request.params;

    const deletedManageMenu = await prisma.manageMenu.delete({
      where: { id: parseInt(id) },
    });

    if (!deletedManageMenu) {
      return {
        statusCode: 404,
        error: "Manage menu not found",
      };
    }

    return {
      statusCode: 200,
      result: {
        message: "Manage menu deleted successfully",
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getManageMenuById = async (request, res) => {
  try {
    const { id } = request.params;
    const manageMenu = await prisma.manageMenu.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!manageMenu) {
      return {
        statusCode: 404,
        error: "Manage menu not found",
      };
    }

    return {
      statusCode: 200,
      result: {
        manageMenu,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const getAllManageMenus = async (request, res) => {
  try {
    const manageMenus = await prisma.manageMenu.findMany({
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    // สร้างฟังก์ชันเพื่อแปลงโครงสร้างข้อมูลเป็นรูปแบบที่ต้องการ
    const formatMenu = (menu) => {
      const { id, menuName, parentId, pathMenu, children } = menu;
      const formattedMenu = { id, name: menuName, parentId, pathMenu };

      if (children && children.length > 0) {
        formattedMenu.children = children.map(child => formatMenu(child)).filter(childMenu => childMenu.parentId === id);
      } else {
        formattedMenu.children = [];
      }

      return formattedMenu;
    };

    // แปลงโครงสร้างข้อมูลที่ได้จาก database ให้เป็นรูปแบบที่ต้องการ
    const result = manageMenus.map(menu => formatMenu(menu)).filter(menu => menu.parentId === null); // กรองเฉพาะเมนูที่ไม่มี parentId

    return {
      statusCode: 200,
      result,
    };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation(error);
  }
};

const uploadFiles = async (request, h) => {
  let file = request.payload.files;
  console.log("🚀 ~ uploadFiles ~ request.payload.files:", request.payload.files)
  file = Array.isArray(file) ? file : [file];

  try {
    const results = await Promise.all(file.map(file => {
      const path = `${process.cwd()}/uploads/${file.hapi.filename}`;
      return new Promise((resolve, reject) => {

        const output = fs.createWriteStream(path);
        file.on('error', err => reject(`Error in ${file.hapi.filename}: ${err}`));

        output.on('finish', () =>
          resolve({
            filename: file.hapi.filename,
            file: path,
            path: `/uploads/${file.hapi.filename}`
          })
        );

        file.pipe(output);
      });
    }));
    return h.response({ message: "Files uploaded", file: results }).code(201).header("Access-Control-Allow-Origin", "*");
  } catch (err) {
    return h.response({ message: "Upload failed", error: err }).code(500).header("Access-Control-Allow-Origin", "*");
  }
};


const getAllFiles = async (request, h) => {
  const directoryPath = process.cwd() + "/uploads/";
  try {
    const files = await fs.promises.readdir(directoryPath);
    const filesWithPath = files.map(file => "/uploads/" + file);
    return h.response(filesWithPath).code(200);
  } catch (err) {
    console.error('Error reading directory:', err);
    return h.response('Failed to read files').code(500);
  }
};

const getByfilename = (request, h) => {
  const filename = request.params.filename;
  const filePath = process.cwd() + "/uploads/" + filename;

  // Ensure the file exists
  if (!fs.existsSync(filePath)) {
    return h.response('File not found').code(404);
  }

  // Return the file as a stream
  return h.file(filePath);
};

const getAllPageTypes = async (request, h) => {
  try {
    const pageTypes = await prisma.pageType.findMany();

    return {
      statusCode: 200,
      result: pageTypes,
    };
  } catch (error) {
    console.error("Error:", error);
    throw Boom.badImplementation(error);
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
  createSinglePages,
  getSinglePageById,
  updateSinglePageById,
  deleteSinglePageById,
  createPageType,
  getPageTypeById,
  deletePageTypeById,
  updatePageTypeById,
  createTag,
  getTagById,
  updateTagById,
  deleteTagById,
  getAllUsers,
  getUserById,
  getAllSinglePages,
  updateUser,
  deleteUser,
  uploadFiles,
  getAllFiles,
  getByfilename,
  getAllPageTypes,
};
