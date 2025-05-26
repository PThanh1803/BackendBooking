const axios = require("axios");
const Location = require("../model/lacaton");

const fetchLocation = async (ip) => {
  try {
    const res = await axios.get(`http://ip-api.com/json/${ip}`);
    const data = res.data;

    if (data.status === "fail") {
      return "IP không hợp lệ";
    }

    const saved = await Location.create({
      ip: data.query,
      city: data.city,
      country: data.country,
      regionName: data.regionName,
      isp: data.isp,
      timezone: data.timezone,
    });

    return {
      status: 200,
      message: "Create Success",
      saved,
    };
  } catch (error) {
    throw new Error("Không thể lấy vị trí: " + err.message);
  }
};

module.exports = { fetchLocation };
