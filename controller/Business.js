const businessService = require("../service/businessService");

const createBusiness = async (req, res) => {
  try {
    console.log(req.body);
    let { name, address, description, image, ratings, averageRating, services } = req.body;
    if (!name || !address || !description || !image || !ratings || !averageRating || !services) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "Missing required fields",
      });
    }
    const data = { name, address, description, image, ratings, averageRating, services };
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

// Cập nhật toàn bộ services của business
const updateBusinessServices = async (req, res) => {
  try {
    const businessId = req.params.id;
    const { services } = req.body;

    if (!services || !Array.isArray(services)) {
      return res.status(400).json({
        status: 400,
        message: "Services data is required and must be an array",
        data: null
      });
    }

    const result = await businessService.updateBusinessServices(businessId, services);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null
    });
  }
};

// Thêm service mới vào business
const addServiceToBusiness = async (req, res) => {
  try {
    const businessId = req.params.id;
    const { serviceId, price, averageRating, ratings } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        status: 400,
        message: "ServiceId is required",
        data: null
      });
    }

    const serviceData = {
      serviceId,
      price: price || 0,
      averageRating: averageRating || 0,
      ratings: ratings || []
    };

    const result = await businessService.addServiceToBusiness(businessId, serviceData);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null
    });
  }
};

// Cập nhật một service cụ thể trong business
const updateServiceInBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const serviceId = req.params.serviceId;
    const { price, averageRating, ratings } = req.body;

    const updateData = {};
    if (price !== undefined) updateData.price = price;
    if (averageRating !== undefined) updateData.averageRating = averageRating;
    if (ratings !== undefined) updateData.ratings = ratings;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 400,
        message: "At least one field (price, averageRating, ratings) is required",
        data: null
      });
    }

    const result = await businessService.updateServiceInBusiness(businessId, serviceId, updateData);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null
    });
  }
};

// Xóa service khỏi business
const removeServiceFromBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    const serviceId = req.params.serviceId;

    const result = await businessService.removeServiceFromBusiness(businessId, serviceId);
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
  getServicesByCity,
  updateBusinessServices,
  addServiceToBusiness,
  updateServiceInBusiness,
  removeServiceFromBusiness
};
