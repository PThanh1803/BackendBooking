const Rating = require("../model/rating");

const createRating = async (data) => {
  try {
    let result = await Rating.create({
      idUser: data.idUser,
      rate: data.rate,
      content: data.content,
    });

    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getRating = async () => {
  let data = await Rating.find().populate("idUser");

  return data;
};

module.exports = { createRating, getRating };
