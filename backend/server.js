require("dotenv").config();
const productRoutes = require("./routes/productRoutes");
const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const billingRoutes = require("./routes/billingRoutes");

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// DB connect
sequelize.sync()
  .then(() => console.log("Database connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/billing", billingRoutes);
