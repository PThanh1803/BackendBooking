const mongoose = require("mongoose");
const ratingSchema = require("./rating").schema;
const mongoose_delete = require("mongoose-delete");

const indiviSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
      required: true,
    },
    ratings: [ratingSchema],
    averageRating: { type: Number, default: 0 },
    description: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // createAt, updateAt
  }
);

indiviSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rate, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

indiviSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Individual = mongoose.model("individual", indiviSchema);

module.exports = Individual;
