const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/add", customerController.addCustomer);
router.get("/", customerController.getCustomers);
router.put("/update/:id", customerController.updateCustomer);
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;