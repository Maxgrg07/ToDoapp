const express = require("express");
const app = express();

const toDo = require("./routes/ToDo");
const user = require("./routes/user");
const auth = require("./routes/auth");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/toDo", toDo);
app.use("/api/user", user);
app.use("/api/auth", auth);

const port = process.env.PORT || 5000;

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/ToDoApp")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log(`Listening to the port ${port}...`);
});
