import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Layout from "../components/Layout";
import { motion } from "framer-motion";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ SAFE chart data (no crash)
  const chartData = data
    ? [
        { name: "Products", value: data.totalProducts },
        { name: "Customers", value: data.totalCustomers },
        { name: "Sales", value: data.totalSales },
      ]
    : [];

  // ✅ LOADING SKELETON
  if (!data) {
    return (
      <Layout>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-24 rounded-xl"></div>
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-24 rounded-xl"></div>
            <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-24 rounded-xl"></div>
          </div>

          <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-64 rounded-xl"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-6">

        {/* Products */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 p-5 rounded-2xl shadow-lg transition"
        >
          <h2>Total Products</h2>
          <p className="text-2xl">{data.totalProducts}</p>
        </motion.div>

        {/* Customers */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 p-5 rounded-2xl shadow-lg transition"
        >
          <h2>Customers</h2>
          <p className="text-2xl">{data.totalCustomers}</p>
        </motion.div>

        {/* Sales */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 p-5 rounded-2xl shadow-lg transition"
        >
          <h2>Sales</h2>
          <p className="text-2xl text-green-600">
            ₹{data.totalSales}
          </p>
        </motion.div>

      </div>

      {/* CHART */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 p-5 shadow rounded-xl"
      >
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </motion.div>
    </Layout>
  );
}

export default Dashboard;
