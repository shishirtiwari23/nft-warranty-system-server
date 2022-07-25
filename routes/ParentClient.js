const {
  addParentClient,
  getParentClient,
} = require("../controllers/ParentClient");
const express = require("express");

const router = express.Router();

router.post("/add-client", addParentClient);
router.get("/parent-clients/:walletAddress", getParentClient);

module.exports = router;
