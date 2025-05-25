const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const ratingSchema = new mongoose.Schema(
  {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rate: { type: Number, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

const Rating = mongoose.model("rating", ratingSchema);

module.exports = Rating;
