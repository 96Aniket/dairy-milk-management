const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BillItem = sequelize.define("BillItem", {
  bill_id: DataTypes.INTEGER,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT,
});

module.exports = BillItem;