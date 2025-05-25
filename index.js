require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dbzbbr0jd",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, //
  // secure: true,
});

module.exports = cloudinary;
