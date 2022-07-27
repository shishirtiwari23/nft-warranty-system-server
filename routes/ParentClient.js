const {
  addParentClient,
  getParentClient,
  regenerateAPIToken,
} = require("../controllers/ParentClient");
const express = require("express");

const router = express.Router();

router.post("/add-parent-client", addParentClient);
router.get("/parent-clients/:walletAddress", getParentClient);
router.post("/parent-client/regenerate-api-token", regenerateAPIToken);

module.exports = router;
