const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    roles: {
      type: String,
      default: "basic",
      enum: ["basic", "admin"],
    },
  })
);

module.exports = User;
