const Customer = require("../models/Customer");

// ➕ ADD CUSTOMER
exports.addCustomer = async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    const customer = await Customer.create({
      name,
      mobile,
      address,
    });

    res.json({ message: "Customer added", customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 GET ALL CUSTOMERS
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ UPDATE CUSTOMER
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, address } = req.body;

    await Customer.update(
      { name, mobile, address },
      { where: { id } }
    );

    res.json({ message: "Customer updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ DELETE CUSTOMER
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await Customer.destroy({ where: { id } });

    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};