const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Bill = sequelize.define("Bill", {
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Bill;