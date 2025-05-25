const Service = require("../model/service");
const Business = require("../model/business");

const createSer = async (data) => {
  try {
    let result = await Service.create({
      title: data.title,
      description: data.description,
      image: data.image,
    });

    if (!result) {
      return {
        status: 400,
        message: "Create service failed",
        data: null,
      };
    }
    return {
      status: 200,
      message: "Create service successfully",
      data: result,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
      message: error.message,
    };
  }
};

const getService = async (searchParams) => {
  try {
    let query = {};

    if (searchParams.name) {
      query.name = { $regex: searchParams.name, $options: "i" };
    }

    let data = await Service.find(query);

    return {
      status: 200,
      message: "Get service successfully",
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

const getServiceByLocation = async (location) => {
  console.log("location", location)
  return await Business.aggregate([
    {
      $match: {
        address: { $regex: location, $options: "i" },
      },
    },
    { $unwind: "$services" },
    {
      $addFields: {
        avgServiceRating: {
          $cond: {
            if: { $gt: [{ $size: "$services.ratings" }, 0] },
            then: { $avg: "$services.ratings.rating" },
            else: 0,
          },
        },
      },
    },
    {
      $lookup: {
        from: "services",
        localField: "services.serviceId",
        foreignField: "_id",
        as: "serviceInfo",
      },
    },
    { $unwind: "$serviceInfo" },
    {
      $project: {
        _id: 0,
        serviceId: "$serviceInfo._id",
        title: "$serviceInfo.title",
        description: "$serviceInfo.description",
        price: "$services.price",
        avgServiceRating: 1,
        businessName: "$name",
        businessAddress: "$address",
      },
    },
    { $sort: { avgServiceRating: -1 } },
    { $limit: 10 },
  ]);
};

const addRating = async (serviceId, userId, rate, comment) => {
  try {
    let data = await Service.findByIdAndUpdate(
      serviceId,
      {
        $push: {
          ratings: { idUser: userId, rate, comment, createdAt: new Date() },
        },
      },
      { new: true }
    );
    if (!data) {
      return {
        status: 404,
        message: "Service not found",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Rating added successfully",
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

const updateService = async (title, description, image) => {
  try {
    let data = await Service.updateOne(
      { title: title },
      { $set: { description, image } }
    );

    if (!data) {
      return "Dịch vụ không tồn tại";
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

module.exports = {
  createSer,
  getService,
  updateService,
  addRating,
  getServiceByLocation,
};
