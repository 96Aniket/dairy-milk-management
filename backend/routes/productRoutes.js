const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Protected routes
router.post("/add", auth, role("admin"), productController.addProduct);
router.put("/update/:id", auth, role("admin"), productController.updateProduct);
router.delete("/delete/:id", auth, role("admin"), productController.deleteProduct);

// Public route
router.get("/", auth, productController.getProducts);

module.exports = router;