const Bill = require("../models/Bill");
const BillItem = require("../models/BillItem");
const Product = require("../models/Product");
const generateInvoice = require("./invoiceGenerator");
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

    // ✅ FIXED: sab yaha andar aayega
    const customer = await Customer.findByPk(customer_id);

    const invoiceItems = [];

    for (let item of items) {
      const product = await Product.findByPk(item.product_id);

      invoiceItems.push({
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const filePath = generateInvoice(bill, invoiceItems, customer);

    res.json({
      message: "Bill created",
      bill,
      invoice: filePath,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};