const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    image: String,
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
    }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, 
  }
);

categorySchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Category = mongoose.model("category", categorySchema);

module.exports = Category;
