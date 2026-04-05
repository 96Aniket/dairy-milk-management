const Bill = require("./Bill");
const BillItem = require("./BillItem");
const Product = require("./Product");

// relations
Bill.hasMany(BillItem, { foreignKey: "bill_id" });
BillItem.belongsTo(Bill, { foreignKey: "bill_id" });

BillItem.belongsTo(Product, { foreignKey: "product_id" });