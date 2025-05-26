const locationSer = require("../service/locationSer");

const getLocation = async (req, res) => {
  const ip = req.query.ip;
  if (!ip) {
    return res.status(400).json({ message: "Thiếu IP" });
  }

  try {
    const location = await locationSer.fetchLocation(ip);
    res.json({ message: "Lưu thành công", data: location });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLocation };
