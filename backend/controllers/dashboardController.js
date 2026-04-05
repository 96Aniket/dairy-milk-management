const { Sequelize } = require("sequelize");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Bill = require("../models/Bill");
const BillItem = require("../models/BillItem");

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalCustomers = await Customer.count();
    const totalSales = (await Bill.sum("total_amount")) || 0;

    const trendRaw = await Bill.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("SUM", Sequelize.col("total_amount")), "sales"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
    });

    const trend = trendRaw.map((item) => ({
      date: item.get("date"),
      sales: Number(item.get("sales")),
    }));

    const topProductsRaw = await BillItem.findAll({
      attributes: [
        "product_id",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"],
      ],
      group: ["product_id"],
      order: [[Sequelize.fn("SUM", Sequelize.col("quantity")), "DESC"]],
      limit: 5,
      include: [{ model: Product, attributes: ["name"] }],
    });

    const topProducts = topProductsRaw.map((item) => ({
      name: item.Product?.name || "Unknown",
      quantity: Number(item.get("totalSold")),
    }));

    const lowStock = await Product.findAll({
      where: {
        stock_quantity: {
          [Sequelize.Op.lt]: 10,
        },
      },
      attributes: ["name", "stock_quantity"],
    });

    res.json({
      totalProducts,
      totalCustomers,
      totalSales,
      trend,
      topProducts,
      lowStock,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
