const Product = require("../models/Product");

// ➕ ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock_quantity } = req.body;

    const existingproduct = await Product.findOne({ where: { name } });
    if (existingproduct) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const existingmobile = await Customer.findOne({ where: { mobile } });
    if (existingmobile) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const product = await Product.create({
      name,
      price,
      stock_quantity,
    });

    res.json({ message: "Product added", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock_quantity } = req.body;

    await Product.update({ name, price, stock_quantity }, { where: { id } });

    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.destroy({ where: { id } });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
