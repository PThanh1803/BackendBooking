const Business = require("../model/business");

const createBusiness = async (data) => {
  try {
    let result = await Business.create({
      name: data.name,
      address: data.address,
      description: data.description,
      image: data.image,
      services: data.services,
      ratings: data.ratings,
      averageRating: data.averageRating,
    });

    return {
      status: 200,
      message: "Create business successfully",
      data: result
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

const getBusiness = async (searchParams = {}) => {
  try {
    let query = {};
    
    // Build search query
    if (searchParams.name) {
      query.name = { $regex: searchParams.name, $options: 'i' };
    }
    if (searchParams.address) {
      query.address = { $regex: searchParams.address, $options: 'i' };
    }

    let data = await Business.find(query)
      .sort({ 
        averageRating: -1,  // Ưu tiên 1: Sắp xếp theo rating cao đến thấp
        'ratings.createdAt': -1,  // Ưu tiên 2: Đánh giá mới nhất
        name: 1  // Ưu tiên 3: Theo bảng chữ cái
      })
      .collation({ locale: "vi", strength: 1 }); // Hỗ trợ sắp xếp tiếng Việt

    return {
      status: 200,
      message: "Get business successfully",
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

const addRating = async (businessId, userId, rate, comment) => {
  try {
    const business = await Business.findOne({
      _id: businessId,
    });

    if (business) {
      const result = await Business.findOneAndUpdate(
        { 
          _id: businessId,
        },
        {
          $set: {
            'ratings.$.idUser': userId,
            'ratings.$.rate': rate,
            'ratings.$.comment': comment,
            'ratings.$.createdAt': new Date()
          }
        },
        { new: true }
      );

      return {
        status: 200,
        message: "Rating updated successfully",
        data: result
      };
    }

    return {
      status: 404,
      message: "Business not found",
      data: null
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

const getByIdBusiness = async (id) => {
  try {
    let data = await Business.findById(id).populate({
      path: 'ratings.userId',
      select: 'name email avatar'
    });

    if (!data) {
      return {
        status: 404,
        message: "Business not found",
        data: null
      };
    }

    return {
      status: 200,
      message: "Get business successfully",
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

const updateBusiness = async (id, data) => {
  try {
    let result = await Business.find(id)
    if (result) {
      if (data.name) {
        result.name = data.name;
      }
      if (data.address) {
        result.address = data.address;
      }
      if (data.description) {
        result.description = data.description;
      }
      if (data.image) {
        result.image = data.image;
      }
      if (data.services) {
        result.services = data.services;
      }
      if (data.ratings) {
        result.ratings = data.ratings;
      }

      await result.save();
      
      return {
        status: 200,
        message: "Update business successfully",
        data: result
      };
    }
    if (!result) {
      return {
        status: 404,
        message: "Business not found",
        data: null
      };
    }
    
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: error.message,
      data: null
    };
  }
};

// Hàm lấy services được sắp xếp theo thành phố và avgRating
const getServicesSortedByCityAndRating = async (searchParams = {}) => {
  try {
    let matchQuery = {};
    
    // Lọc theo thành phố nếu có
    if (searchParams.city) {
      matchQuery.address = { $regex: searchParams.city, $options: 'i' };
    }

    // Aggregation pipeline để lấy services từ businesses
    const pipeline = [
      // Lọc businesses theo thành phố
      { $match: matchQuery },
      
      // Unwind services array để có thể sort từng service
      { $unwind: "$services" },
      
      // Populate thông tin service
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceInfo"
        }
      },
      
      // Unwind serviceInfo
      { $unwind: "$serviceInfo" },
      
      // Tạo document mới với thông tin cần thiết
      {
        $project: {
          _id: "$services.serviceId",
          businessId: "$_id",
          businessName: "$name",
          businessAddress: "$address",
          city: {
            $arrayElemAt: [
              { $split: ["$address", ","] },
              -1
            ]
          }, // Lấy phần cuối của address làm city
          serviceTitle: "$serviceInfo.title",
          serviceDescription: "$serviceInfo.description",
          serviceImage: "$serviceInfo.image",
          price: "$services.price",
          averageRating: "$services.averageRating",
          ratings: "$services.ratings",
          createdAt: "$serviceInfo.createdAt"
        }
      },
      
      // Sắp xếp theo city trước (A-Z), sau đó theo averageRating (cao đến thấp) trong mỗi city
      {
        $sort: {
          city: 1,
          averageRating: -1,
          serviceTitle: 1
        }
      }
    ];

    // Thêm filter theo rating nếu có
    if (searchParams.minRating) {
      pipeline.splice(-1, 0, {
        $match: {
          averageRating: { $gte: parseFloat(searchParams.minRating) }
        }
      });
    }

    // Thêm limit nếu có
    if (searchParams.limit) {
      pipeline.push({ $limit: parseInt(searchParams.limit) });
    }

    const services = await Business.aggregate(pipeline);

    return {
      status: 200,
      message: "Get services sorted by city and rating successfully",
      data: services,
      total: services.length
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

// Hàm lấy services được sắp xếp theo thành phố trước, rating sau (rõ ràng hơn)
const getServicesByCity = async (searchParams = {}) => {
  try {
    let matchQuery = {};
    
    // Lọc theo thành phố nếu có
    if (searchParams.city) {
      matchQuery.address = { $regex: searchParams.city, $options: 'i' };
    }

    const pipeline = [
      // Bước 1: Lọc businesses theo thành phố
      { $match: matchQuery },
      
      // Bước 2: Unwind services array
      { $unwind: "$services" },
      
      // Bước 3: Populate thông tin service
      {
        $lookup: {
          from: "services",
          localField: "services.serviceId",
          foreignField: "_id",
          as: "serviceInfo"
        }
      },
      { $unwind: "$serviceInfo" },
      
      // Bước 4: Tạo document với thông tin cần thiết
      {
        $project: {
          _id: "$services.serviceId",
          businessId: "$_id",
          businessName: "$name",
          businessAddress: "$address",
          city: {
            $trim: {
              input: {
                $arrayElemAt: [
                  { $split: ["$address", ","] },
                  -1
                ]
              }
            }
          },
          serviceTitle: "$serviceInfo.title",
          serviceDescription: "$serviceInfo.description",
          serviceImage: "$serviceInfo.image",
          price: "$services.price",
          averageRating: "$services.averageRating",
          ratings: "$services.ratings",
          createdAt: "$serviceInfo.createdAt"
        }
      },
      
      // Bước 5: Lọc theo rating tối thiểu nếu có
      ...(searchParams.minRating ? [{
        $match: {
          averageRating: { $gte: parseFloat(searchParams.minRating) }
        }
      }] : []),
      
      // Bước 6: Nhóm theo thành phố và sắp xếp services theo rating trong mỗi nhóm
      {
        $group: {
          _id: "$city",
          services: {
            $push: {
              serviceId: "$_id",
              businessId: "$businessId",
              businessName: "$businessName",
              businessAddress: "$businessAddress",
              serviceTitle: "$serviceTitle",
              serviceDescription: "$serviceDescription",
              serviceImage: "$serviceImage",
              price: "$price",
              averageRating: "$averageRating",
              ratings: "$ratings",
              createdAt: "$createdAt"
            }
          },
          totalServices: { $sum: 1 },
          cityAverageRating: { $avg: "$averageRating" }
        }
      },
      
      // Bước 7: Sắp xếp services trong mỗi thành phố theo rating (cao đến thấp)
      {
        $addFields: {
          services: {
            $sortArray: {
              input: "$services",
              sortBy: { 
                averageRating: -1,
                serviceTitle: 1
              }
            }
          }
        }
      },
      
      // Bước 8: Sắp xếp các thành phố theo tên (A-Z)
      { $sort: { _id: 1 } },
      
      // Bước 9: Format kết quả cuối cùng
      {
        $project: {
          city: "$_id",
          totalServices: 1,
          cityAverageRating: { $round: ["$cityAverageRating", 2] },
          services: 1,
          _id: 0
        }
      }
    ];

    // Thêm limit cho mỗi thành phố nếu có
    if (searchParams.limitPerCity) {
      pipeline.splice(-2, 0, {
        $addFields: {
          services: {
            $slice: ["$services", parseInt(searchParams.limitPerCity)]
          }
        }
      });
    }

    const result = await Business.aggregate(pipeline);

    return {
      status: 200,
      message: "Get services by city successfully",
      data: result,
      total: result.length,
      totalServices: result.reduce((sum, city) => sum + city.totalServices, 0)
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



module.exports = {
  createBusiness,
  getBusiness,
  addRating,
  getByIdBusiness,
  updateBusiness,
  getServicesSortedByCityAndRating,
  getServicesByCity,
};
