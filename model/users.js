const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phone: String,
    address: String,
    avatar: String,
    favorite: { 
      business: [{ type: mongoose.Schema.Types.ObjectId, ref: "business" }],
      individual: [{ type: mongoose.Schema.Types.ObjectId, ref: "individual" }],
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, 
  }
);

userSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("user", userSchema);

module.exports = User;
