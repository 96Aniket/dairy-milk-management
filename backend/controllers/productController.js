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

    await Product.update({ name, price, stock_quantity }, { where: { id } });

    res.json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.destroy({ where: { id } });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
