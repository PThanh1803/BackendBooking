const categoryService = require("../service/categoryService");
const Category = require("../model/categogy");
const Business = require("../model/business")

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

const getPopularCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("services")
      .lean();

    for (const category of categories) {
      const serviceIds = category.services.map(s => s._id);

      // Lấy rating trung bình của từng service trong category
      const ratings = await Business.aggregate([
        { $unwind: "$services" },
        { $match: { "services.serviceId": { $in: serviceIds } } },
        {
          $project: {
            serviceId: "$services.serviceId",
            avgRating: { $avg: "$services.ratings.rating" }
          }
        },
        {
          $group: {
            _id: "$serviceId",
            avgRating: { $avg: "$avgRating" }
          }
        }
      ]);

      const ratingMap = {};
      ratings.forEach(r => {
        ratingMap[r._id.toString()] = r.avgRating || 0;
      });

      // Thêm avgRating vào từng service
      category.services = category.services.map(service => ({
        ...service,
        avgRating: ratingMap[service._id.toString()] || 0
      }))
      .sort((a, b) => b.avgRating - a.avgRating); // sort service trong category theo rating
    }

    return res.status(200).json({
      status: 200,
      data: categories,
      message: "Success"
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: [],
      message: error.message || "Internal Server Error"
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
  getPopularCategories,
  updateCategory,
  getByIdCategory,
};
