const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const ratingSchema = require("./rating").schema;


const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: String,
    image: String,
    ratings: [ratingSchema],
    services: [{
      serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    },
      price: { type: Number, default: 0 },
      ratings: [ratingSchema],
      averageRating: { type: Number, default: 0 },
    }
    ],
averageRating: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now },
  },
{
  timestamps: true,
  }
);

// Middleware to calculate average rating before saving
businessSchema.pre('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rate, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

businessSchema.pre('save', function (next) {
  if (this.services && this.services.length > 0) {
    const sum = this.services.reduce((acc, curr) => acc + curr.averageRating, 0);
    this.averageRating = sum / this.services.length;
  }
  next();
});

businessSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Business = mongoose.model("business", businessSchema);

module.exports = Business;
