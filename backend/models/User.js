const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // 🔥 important
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;