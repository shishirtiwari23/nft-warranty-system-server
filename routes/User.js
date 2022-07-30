const express = require("express");
const {
  addUser,
  login,
  addToken,
  getUserTokensByClientId,
  getUserCollections,
  transferOwnership,
} = require("../controllers/User");
const { auth } = require("../middlewares/auth");
const { authenticateJWT } = require("../utils/functions");

const router = express.Router();

router.post("/login", login);
router.post("/add-user", auth, addUser);
router.post("/add-token", auth, addToken);
router.post("/all-nfts", auth, getUserTokensByClientId);
router.get("/collections/:walletAddress", auth, getUserCollections);
router.post("/transfer-ownership", auth, transferOwnership);

// router.get("/users/:walletAddress", authenticateJWT, getUser);

// router.post("/add-user", addUser);
// router.get("/users", getAllUsers);
// router.get("/users/:id", getUser);
// router.patch("/users/:id", updateUser);

module.exports = router;
