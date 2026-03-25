const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Bill = require("../models/Bill");

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalCustomers = await Customer.count();

    const bills = await Bill.findAll();

    let totalSales = 0;
    bills.forEach((b) => {
      totalSales += b.total_amount;
    });

    res.json({
      totalProducts,
      totalCustomers,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
