const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const auth = require("../middleware/authMiddleware");

router.post("/create", billingController.createBill);
router.get("/", auth, billingController.getBills);

module.exports = router;