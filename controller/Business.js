const businessService = require("../service/businessService");

const createBusiness = async (req, res) => {
  try {
    let { name, address, description, image, ratings, averageRating } = req.body;

    const data = { name, address, description, image, ratings, averageRating };
    let business = await businessService.createBusiness(data);
    return res
      .status(200)
      .json({ status: 200, message: "Create Success", data: business });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};

const addRating = async (req, res) => {
  try {
    const { businessId, userId, rate, comment } = req.body;
    const data = await businessService.addRating(businessId, userId, rate, comment);
    return res.status(data.status).json(data);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
}
const getAllBusiness = async (req, res) => {
  try {
    const { name, address } = req.query;
    const searchParams = {
      name,
      address
    };

    const result = await businessService.getBusiness(searchParams);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null
    });
  }
};


const updateBusiness = async (req, res) => {
  try {
    let { name, description, image, rating, services } = req.body;
    const id = req.params.id;
    const data = await businessService.updateBusiness(
      id,
      {
        name,
        description,
        image,
        rating,
        services
      }
    );
    return res
      .status(200)
      .json({ status: 200, message: "Update Success", data });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};

const getByIdBusiness = async (req, res) => {
  try {
    let id = req.params.id;
    let bunisess = await businessService.getByIdBusiness(id);
    if (!bunisess) {
      return res.status(404).json({ message: "Không tìm thấy bunisess" });
    }
    return res.status(200).json({ status: 200, message: "Success", bunisess });
  } catch (error) {
    res.status(400).json({ status: 400, data: {}, message: "Bad Request" });
  }
};





// Lấy services theo thành phố trước, rating sau (rõ ràng hơn)
const getServicesByCity = async (req, res) => {
  try {
    const { city, minRating, limitPerCity } = req.query;
    const searchParams = {
      city,
      minRating,
      limitPerCity
    };

    const result = await businessService.getServicesByCity(searchParams);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null
    });
  }
};

module.exports = {
  createBusiness,
  getAllBusiness,
  updateBusiness,
  getByIdBusiness,
  addRating,
  getServicesByCity
};
