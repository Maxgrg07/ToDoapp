const mongoose = require("mongoose");

const ToDoList = mongoose.model(
  "ToDoList",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
    },
    addedBy: {
      type: String,
      required: true,
    },
  })
);
module.exports = ToDoList;
