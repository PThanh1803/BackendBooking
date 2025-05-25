const RatingSer = require("../service/ratingService");

const createRating = async (req, res) => {
  try {
    let { idUser, rate, content } = req.body;

    const data = { idUser, rate, content };

    let rating = await RatingSer.createRating(data);
    return res.status(200).json({ errcode: 0, data: rating });
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      data: {},
    });
  }
};
const getAllRating = async (req, res) => {
  try {
    const data = await RatingSer.getRating();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      data: {},
    });
  }
};

module.exports = { createRating, getAllRating };
