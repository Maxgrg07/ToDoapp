const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcrypt");

router.post(
  "/",
  body("name").exists().isString().withMessage("Invalid Name"),
  body("email").exists().isEmail().withMessage("Invalid Email"),
  body("password").exists().isString().isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ status: "error", message: " User already register" });
      }
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        roles: req.body.roles,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      res.status(200).json({ status: "Sucess", data: { user: user } });
    } catch (error) {
      console.log(error.toString());
    }
  }
);

module.exports = router;
