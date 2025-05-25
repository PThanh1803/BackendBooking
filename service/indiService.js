const Individuals = require("../model/individual");

const createIndivid = async (data) => {
  try {
    let result = await Individuals.create({
      name: data.name,
      businessId: data.businessId,
      address: data.address,
      description: data.description,
      image: data.image,
      ratings: data.ratings,
      averageRating: data.averageRating,
    });

    return {
      status: 200,
      message: "Create individual successfully",
      data: result
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal Server Error",
    };
  }
};

const getIndivid = async (searchParams = {}) => {
  try {
    let query = {};

    if (searchParams.name) {
      query.name = { $regex: searchParams.name, $options: 'i' };
    }

    if (searchParams.address) {
      query.address = { $regex: searchParams.address, $options: 'i' };
    }


    let data = await Individuals.find(query).populate("businessId")
      .sort({ 
        averageRating: -1,  // Ưu tiên 1: Sắp xếp theo rating cao đến thấp
        'ratings.createdAt': -1,  // Ưu tiên 2: Đánh giá mới nhất
        name: 1  // Ưu tiên 3: Theo bảng chữ cái
      })
      .collation({ locale: "vi", strength: 1 }); // Hỗ trợ sắp xếp tiếng Việt

    return {
      status: 200,
      message: "Get individual successfully",
      data: data
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null
    };
  }
};

const addRating = async (individualId, userId, rate, comment) => {
  try {
    let data = await Individuals.findByIdAndUpdate(
      individualId,
      { $push: { ratings: { idUser: userId, rate, comment, createdAt: new Date() } } },
      { new: true }
    );
    if (!data) {
      return {
        status: 404,
        message: "Individual not found",
        data: null
      };
    }

    return {
      status: 200,
      message: "Rating added successfully",
      data: data
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
      data: null
    };
  }
};

const updateIndivid = async (name, description, image) => {
  try {
    let data = await Individuals.updateOne(
      { name: name },
      { $set: { description, image } }
    );

    if (!data) {
      return "Không tồn tại";
    }

    return data;
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal Server Error",
    };
  }
};

const getByIdIndivid = async (id) => {
  try {
    let data = await Individuals.findById(id).populate("businessId");

    return data;
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: "Internal Server Error",
    };
  }
};

module.exports = { createIndivid, getIndivid, updateIndivid, getByIdIndivid, addRating };
