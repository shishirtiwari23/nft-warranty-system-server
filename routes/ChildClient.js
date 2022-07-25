const {
  getChildClient,
  addChildClient,
} = require("../controllers/ChildClient");
const express = require("express");

const router = express.Router();

router.post("/add-child-client", addChildClient);
router.post("/child-client/:walletAddress", getChildClient);

module.exports = router;
