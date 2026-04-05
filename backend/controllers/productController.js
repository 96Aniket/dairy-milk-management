const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock_quantity } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name & Price required" });
    }

    const existing = await Product.findOne({ where: { name } });

    if (existing) {
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = await Product.create({
      name,
      price,
      stock_quantity,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock_quantity } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.stock_quantity = stock_quantity ?? product.stock_quantity;

    await product.save();

    res.json({ message: "Product updated successfully", product });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid quantity required" });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock_quantity += Number(quantity);

    await product.save();

    res.json({ message: "Stock updated", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
