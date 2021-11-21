const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

router.post(
  "/",

  body("password")
    .exists()
    .isString()
    .isLength({ min: 5 })
    .withMessage("Invalid Password"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let user = await User.findOne({ email: req.body.email });
      console.log(user);

      if (!user) {
        return res
          .status(400)
          .json({ status: "Error", message: "User not found" });
      }
      console;
      const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!validatePassword) {
        return res
          .status(400)
          .json({ status: "Error", message: "Invalid Password" });
      }
      console.log("hello" + user);
      const token = jwt.sign({ _id: user._id }, process.env.jwtPrivateKey);
      res.header("x-auth-token", token).send(token);
    } catch (error) {
      console.log(error.toString());
      return res.status(400).json({ status: "Error", message: error.message });
    }
  }
);

module.exports = router;
