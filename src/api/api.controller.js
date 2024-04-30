const Boom = require("@hapi/boom");
const handler = require("./api.handler");
const uitls = require("../utils/utils-common");

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
    const fullName = await handler.mergeName(profile.firstName, profile.lastName);

    return {
      id: id,
      name: name,
      fullName: fullName,
      age:age,
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
    const fullName = await handler.mergeName(
      profile.firstName,
      profile.lastName,
      age.age,
    );
    const date = uitls.convertStrToDate(profile.birthDate);
    console.log("🚀 ~ getPostData ~ date:", date)
    return {
      id: id,
      name: name,
      profile: profile,
      fullName: fullName,
      birthDate: date,
      age:age,
    };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation(error);
  }
};

module.exports = {
  helloWord,
  getParameter,
  getQueryString,
  getPostData,
};
