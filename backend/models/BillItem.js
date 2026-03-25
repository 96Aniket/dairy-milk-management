const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BillItem = sequelize.define("BillItem", {
  bill_id: {
    type: DataTypes.INTEGER,
  },
  product_id: {
    type: DataTypes.INTEGER,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.FLOAT,
  },
});

module.exports = BillItem;