const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const ToDoList = require("../model/ToDoList");
const { auth, Permission, DeletePermission } = require("../middleware/auth");

//posting ToDOList
router.post(
  "/",
  body("title").isString(),
  body("description").isString(),
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const user = req.user;
      console.log("hsgd" + user);
      const toDoList = new ToDoList({
        title: req.body.title,
        description: req.body.description,
        addedBy: user._id,
      });
      await toDoList.save();
      res.status(200).send(toDoList);
    } catch (error) {
      console.log(error.toString());
    }
  }
);

// for getting list of all the todolist
router.get("/", async (req, res) => {
  try {
    await ToDoList.find({}, (error, ToDoList) => {
      if (error) {
        res.status(400).json({ status: "error", message: error.message });
      } else {
        res
          .status(200)
          .json({ status: "Sucess", data: { ToDoList: ToDoList } });
      }
    });
  } catch (err) {
    return res.status(400).json({ status: "Error", message: error.message });
  }
});

//For deleting todolist
router.delete("/:id", auth, DeletePermission, async (req, res) => {
  const id = req.params.id;
  try {
    await ToDoList.deleteOne({ _id: id });

    return res
      .status(200)
      .json({ status: "Success", message: "Successfully deleted!!" });
  } catch (ex) {
    return res.status(404).json({ status: "error", message: ex.message });
  }
});

//For updating todolist

router.put("/:id", auth, Permission, async (req, res) => {
  const id = req.params.id;

  try {
    const toDoList = await ToDoList.findById(id);

    if (!toDoList) {
      return res
        .status(400)
        .json({ status: "error", data: { ToDoList: "There isnt any list" } });
    }
    if (req.body.title) {
      toDoList.title = req.body.title;
    }
    if (req.body.description) {
      toDoList.description = req.body.description;
    }

    toDoList.save((error, result) => {
      if (error) {
        return res
          .status(400)
          .json({ status: "Error", message: error.message });
      } else {
        return res
          .status(200)
          .json({ status: "Success", data: { toDoList: result } });
      }
    });
  } catch (ex) {
    return res.status(400).json({ status: "Error", message: ex.message });
  }
});

module.exports = router;
