const individualSer = require("../service/indiService");

const createIndividuals = async (req, res) => {
  try {
    let { name, businessId, address, description, image, ratings, averageRating } = req.body;

    const data = { name, businessId, address, description, image, ratings, averageRating };

    let individual = await individualSer.createIndivid(data);
    return res.status(individual.status).json(individual);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};

const getAllIndividuals = async (req, res) => {
  try {
    const { name, address } = req.query;
    const searchParams = {
      name,
      address
    };
    const data = await individualSer.getIndivid(searchParams);
    return res.status(data.status).json(data);
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
    const { individualId, userId, rate, comment } = req.body;
    const data = await individualSer.addRating(individualId, userId, rate, comment);
    return res.status(data.status).json(data);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};
const updateIndividuals = async (req, res) => {
  try {
    let { name, description, image } = req.body;
    const data = await individualSer.updateIndivid(name, description, image);
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

const getByIdIndividuals = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await individualSer.getByIdIndivid(id);
    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy Individual" });
    }
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ status: 400, data: {}, message: "Bad Request" });
  }
};

module.exports = {
  createIndividuals,
  getAllIndividuals,
  updateIndividuals,
  getByIdIndividuals,
  addRating
};
