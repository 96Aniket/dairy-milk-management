const Bill = require("../models/Bill");
const BillItem = require("../models/BillItem");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// CREATE BILL
exports.createBill = async (req, res) => {
  try {
    const { customer_id, items } = req.body;

    let total = 0;

    // calculate total
    for (let item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      total += product.price * item.quantity;
    }

    // create bill
    const bill = await Bill.create({
      customer_id,
      total_amount: total,
    });

    // save items + reduce stock
    for (let item of items) {
      const product = await Product.findByPk(item.product_id);

      await BillItem.create({
        bill_id: bill.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price,
      });

      product.stock_quantity -= item.quantity;
      await product.save();
    }

    res.status(200).json({
      message,
      bill,
      invoice: filePath,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: [
        {
          model: BillItem,
          include: [Product],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
