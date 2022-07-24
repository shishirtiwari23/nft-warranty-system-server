const express = require("express");
const {
  addUser,
  getAllUsers,
  getUser,
  updateUser,
} = require("../controllers/User");

const router = express.Router();

router.post("/add-user", addUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.post("/users/:id", updateUser);

module.exports = router;
