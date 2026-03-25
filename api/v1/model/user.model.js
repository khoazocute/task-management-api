const mongoose = require("mongoose");
const generate = require("../../../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: { //Lưu token cho mỗi user
      type: String,
      default: () => generate.generateRandomString(30)
    },
    status: {
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users"); 
// Khai báo model User và dùng collection trên users trên mongodb
module.exports = User;
