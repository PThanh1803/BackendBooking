const categoryService = require("../service/categoryService");

const createCategory = async (req, res) => {
  try {
    let { name, description, image, services } = req.body;

    const data = { name, description, image, services };
    let categories = await categoryService.createCategory(data);
    return res
      .status(categories.status)
      .json({ categories });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: error.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const data = await categoryService.getCategory();
    return res.status(data.status).json(data);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    let { name, description, image, services } = req.body;
    const data = await categoryService.updateCategory(name, description, image, services);
    return res
      .status(data.status)
      .json({ status: data.status, message: data.message, data: data.data });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: error.message,
    });
  }
};

const getByIdCategory = async (req, res) => {
  try {
    let id = req.params.id;
    let categories = await categoryService.getByIdCategory(id);
    if (!categories) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }
    return res.status(200).json(categories);
  } catch (error) {
    res
      .status(400)
      .json({ status: 400, categories: {}, message: "Bad Request" });
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  updateCategory,
  getByIdCategory,
};
