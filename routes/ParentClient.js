const {
  addParentClient,
  getParentClient,
  regenerateAPIToken,
  getAllContractAddresses,
} = require("../controllers/ParentClient");
const express = require("express");

const router = express.Router();

router.post("/add-parent-client", addParentClient);
router.get("/parent-clients/:walletAddress", getParentClient);
router.post("/parent-client/regenerate-api-token", regenerateAPIToken);
router.get("/all-contract-addresses/:walletAddress", getAllContractAddresses);

module.exports = router;
