const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

router.post("/create", billingController.createBill);

module.exports = router;