const express = require("express");
const {
  addUser,
  login,
  addToken,
  getUserTokensByClientId,
  getUserCollections,
  transferOwnership,
  issueComplaint,
  updateStatus,
} = require("../controllers/User");
const { auth } = require("../middlewares/auth");
const { authenticateJWT } = require("../utils/functions");

const router = express.Router();

router.post("/login", login);
<<<<<<< HEAD
router.post("/add-user", addUser);
router.post("/add-token", addToken);
router.post("/all-nfts", getUserTokensByClientId);
router.get("/collections/:walletAddress", getUserCollections);
router.post("/transfer-ownership", transferOwnership);
router.post("/issue-complaint", issueComplaint);
router.post("/update-status", updateStatus);
=======
router.post("/add-user", auth, addUser);
router.post("/add-token", auth, addToken);
router.post("/all-nfts", auth, getUserTokensByClientId);
router.get("/collections/:walletAddress", auth, getUserCollections);
router.post("/transfer-ownership", auth, transferOwnership);
>>>>>>> d754dcb9742e315015a8eaf41fe4126198f90a38

// router.get("/users/:walletAddress", authenticateJWT, getUser);

// router.post("/add-user", addUser);
// router.get("/users", getAllUsers);
// router.get("/users/:id", getUser);
// router.patch("/users/:id", updateUser);

module.exports = router;
