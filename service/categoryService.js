const Category = require("../model/categogy");
const Service = require("../model/service");
const { eventNames } = require("../model/service");

const createCategory = async (data) => {
  try {

    let datas = await Category.create({
      name: data.name,
      description: data.description,
      image: data.image,
      services: data.services,
    });

    if (!datas) {
      return {
        status: 400,
        message: "Create category failed",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Create category successfully",
      data: datas,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal Server Error",
    };
  }
};

const getCategory = async () => {
  try {
    let data = await Category.find();
    if (!data) {
      return {
        status: 400,
        message: "Get category failed",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Get category successfully",
      data: data,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal Server Error",
    };
  }
};

const getByIdCategory = async (id) => {
  try {
    let data = await Category.findById(id);

    return data;
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal Server Error",
    };
  }
};

const updateCategory = async (name, description, image, services) => {
  try {
    let data = await Category.updateOne(
      { name: name },
      { $set: { description, image, services } }
    );

    if (!data) {
      return {
        status: 400,
        message: "Update category failed",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Update category successfully",
      data: data,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message,
    };
  }
};

module.exports = {
  createCategory,
  getByIdCategory,
  getCategory,
  updateCategory,
};
