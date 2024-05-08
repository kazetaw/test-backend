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
      },
    };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation(error);
  }
};
const userLogin = async (request, response) => {
  try {
    const { username, password } = request.payload;

    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    if (!user) {
      return Boom.notFound("User not found");
    }

    // เข้ารหัสรหัสผ่านที่รับมาเป็น MD5
    const hashedPassword = md5(password);

    // ตรวจสอบรหัสผ่านที่เข้ารหัสแล้วว่าตรงกันหรือไม่
    if (user.password !== hashedPassword) {
      return Boom.unauthorized("Incorrect password");
    }

    // ส่งคืนข้อมูลผู้ใช้ที่เข้าสู่ระบบสำเร็จ
    return { message: "Login successful", user: { username: user.username, firstName: user.firstName, lastName: user.lastName } };
  } catch (error) {
    console.error("Error:", error);
    return Boom.badImplementation("Internal server error");
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

    // สร้างผู้ใช้ใหม่
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
const userRegister = async (request, response) => {
  try {
    const { username, password, firstName, lastName } = request.payload;

    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return Boom.badRequest('Username already exists');
    }

    // เข้ารหัสรหัสผ่านเป็น MD5
    const hashedPassword = md5(password);

    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword, // ใช้รหัสผ่านที่เข้ารหัสแล้ว
        firstName: firstName,
        lastName: lastName,
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
    const { title, content, timestamp_create, title_images, pagelink, type_id } = request.payload;

    const newSinglePage = await prisma.singlePage.create({
      data: {
        title,
        content,
        timestamp_create,
        title_images,
        pagelink,
        type: { connect: { type_id } } // Connect to PageType
      }
    });

    return { message: 'Single page created successfully', data: newSinglePage };
  } catch (error) {
    console.error('Error:', error);
    return Boom.badImplementation('Internal server error');
  }
};
const updatePageTypeById = async (request, h) => {
  try {
    const { id } = request.params; // รับค่า ID ของ PageType ที่ต้องการอัปเดต
    const { type_name } = request.payload; // รับค่า type_name ที่ต้องการเปลี่ยนแปลง

    const updatedPageType = await prisma.pageType.update({
      where: { type_id: parseInt(id) }, // กำหนดเงื่อนไขในการค้นหา PageType ที่ต้องการอัปเดตตาม ID
      data: {
        type_name // กำหนดค่าใหม่ของ type_name ที่ต้องการเปลี่ยนแปลง
      }
    });

    return { message: 'PageType updated successfully', data: updatedPageType };
  } catch (error) {
    console.error('Error:', error);
    return Boom.badImplementation('Internal server error');
  }
};


const getSinglePageById = async (request, h) => {
  try {
    const { id } = request.params;

    const singlePage = await prisma.singlePage.findUnique({
      where: { id: parseInt(id) },
      include: { type: true } // Include PageType information
    });

    if (!singlePage) {
      return Boom.notFound('Single page not found');
    }

    return { data: singlePage };
  } catch (error) {
    console.error('Error:', error);
    return Boom.badImplementation('Internal server error');
  }
};

const updateSinglePageById = async (request, h) => {
  try {
    const { id } = request.params; // รับค่า ID ของ SinglePage ที่ต้องการอัปเดต
    const { title, content, timestamp_create, title_images, pagelink, type_id } = request.payload; // รับค่าที่ต้องการเปลี่ยนแปลง

    const updatedSinglePage = await prisma.singlePage.update({
      where: { id: parseInt(id) }, // กำหนดเงื่อนไขในการค้นหา SinglePage ที่ต้องการอัปเดตตาม ID
      data: {
        title,
        content,
        timestamp_create,
        title_images,
        pagelink,
        type_id // กำหนดค่าใหม่ของ type_id ที่ต้องการเปลี่ยนแปลง
      }
    });

    return { message: 'SinglePage updated successfully', data: updatedSinglePage };
  } catch (error) {
    console.error('Error:', error);
    return Boom.badImplementation('Internal server error');
  }
};


const deleteSinglePageById = async (request, h) => {
  try {
    const { id } = request.params;

    await prisma.singlePage.delete({
      where: { id: parseInt(id) }
    });

    return { message: 'Single page deleted successfully' };
  } catch (error) {
    console.error('Error:', error);
    return Boom.badImplementation('Internal server error');
  }
};
const createPageType = async (request, h) => {
  try {
    const { type_name } = request.payload; // รับค่า type_name ที่ต้องการสร้าง

    const newPageType = await prisma.pageType.create({
      data: {
        type_name // กำหนดค่าใหม่ของ type_name ที่ต้องการสร้าง
      }
    });

    return { message: 'PageType created successfully', data: newPageType };
  } catch (error) {
    console.error('Error:', error);
    return Boom.badImplementation('Internal server error');
  }
};

module.exports = {
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
  updatePageTypeById,
  createPageType,
};
