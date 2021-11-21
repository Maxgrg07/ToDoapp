const jwt = require("jsonwebtoken");
const User = require("../model/user");
const ToDoList = require("../model/ToDoList");

async function auth(req, res, next) {
  const token = req.header("Authorization");
  try {
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Accessed denied!! No token provided ",
      });
    }

    const decoded = jwt.decode(token, process.env.jwtPrivateKey);
    // req.user = decoded;
    req.user = await User.findById(decoded._id);

    // console.log("Hello" + decoded);
    next();
  } catch (ex) {
    return res.status(400).json({ status: "Error", message: ex.message });
  }
}

async function Permission(req, res, next) {
  const user = req.user;
  const ToDoId = req.params.id;
  console.log("Perr" + user);
  try {
    const toDoList = await ToDoList.findById(ToDoId);
    if (!toDoList) {
      return res
        .status(400)
        .json({ status: "Error", message: "ToDoList Not found!!!" });
    } else {
      if (toDoList.addedBy == user._id || user.roles == "admin") {
        console.log(toDoList);
        next();
      } else {
        return res
          .status(400)
          .json({ status: "Error", message: "accessed denied" });
      }
    }
  } catch (ex) {
    return res.status(400).json({ status: "Error", message: ex.message });
  }
}

async function DeletePermission(req, res, next) {
  const user = req.user;
  console.log("Helllll" + user);
  try {
    if (user.roles == "admin" && user._id == req.params.id) {
      next();
    } else {
      return res.status(400).json({ status: "Error", message: error.message });
    }
  } catch (ex) {
    return res.status(400).json({ status: "Error", message: ex.message });
  }
}

module.exports.auth = auth;
module.exports.Permission = Permission;
module.exports.DeletePermission = DeletePermission;
