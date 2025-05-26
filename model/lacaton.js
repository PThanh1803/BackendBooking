const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const locaSchema = new mongoose.Schema(
  {
    ip: { type: String },
    city: { type: String, required: true },
    country: { type: String },
    regionName: { type: String },
    isp: { type: String },
    timezone: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

const Location = mongoose.model("location", locaSchema);

module.exports = Location;
