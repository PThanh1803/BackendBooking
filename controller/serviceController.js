const serService = require("../service/serService");

const createService = async (req, res) => {
  try {
    let { title, description, image } = req.body;

    const data = { title, description, image };
    let service = await serService.createSer(data);
    return res
      .status(200)
      .json({ status: 200, message: "Create Success", data: service });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};

const getServiceByLocation = async (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Location is required",
    });
  }

  try {
    const data = await serService.getServiceByLocation(location);
    return res.status(200).json({
      status: 200,
      data,
      message: "Success",
    });
  } catch (error) {
    console.error("getServiceByLocation error:", error);
    return res.status(500).json({
      status: 500,
      data: {},
      message: "Internal Server Error",
    });
  }
};
const getAllService = async (req, res) => {
  const { name } = req.query;
  const searchParams = {
    name,
  };
  
  try {
    const data = await serService.getService(searchParams);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};
const updateService = async (req, res) => {
  try {
    let { title, description, image } = req.body;
    const data = await serService.updateService(title, description, image);
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

const addRating = async (req, res) => {
  try {
    const { serviceId, userId, rate, comment } = req.body;
    const data = await serService.addRating(serviceId, userId, rate, comment);
    return res.status(data.status).json(data);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};
module.exports = { createService, getServiceByLocation, updateService, addRating, getAllService };
