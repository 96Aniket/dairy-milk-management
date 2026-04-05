import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  PieChart,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  Pie,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Layout from "../components/Layout";
import { motion } from "framer-motion";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b"];

function Dashboard() {
  const [data, setData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard");

      setData(res.data);
      setTrendData(res.data.trend || []);
      setTopProducts(res.data.topProducts || []);
      setLowStock(res.data.lowStock || []);
    } catch (error) {
      console.error(error);
    }
  };

  const growthData = trendData.map((item, index) => {
    if (index === 0) return { ...item, growth: 0 };

    const prev = trendData[index - 1].sales;
    const growth = prev > 0 ? ((item.sales - prev) / prev) * 100 : 0;

    return {
      date: item.date,
      growth,
    };
  });

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

  const avgSale =
    data.totalCustomers > 0
      ? (data.totalSales / data.totalCustomers).toFixed(2)
      : 0;

  const stockHealth =
    data.totalProducts > 0
      ? data.totalProducts < 10
        ? "Low Stock"
        : "Healthy"
      : "No Products";

  const growthPercentage =
    trendData.length > 1 && trendData[trendData.length - 2].sales > 0
      ? (
          ((trendData[trendData.length - 1].sales -
            trendData[trendData.length - 2].sales) /
            trendData[trendData.length - 2].sales) *
          100
        ).toFixed(1)
      : 0;

  const percentage = Math.min((data.totalSales / 100000) * 100, 100);

  const gaugeData = [{ value: percentage }, { value: 100 - percentage }];

  const total = data.totalProducts + data.totalCustomers + data.totalSales || 1;

  const chartData = [
    {
      name: "Products",
      value: (data.totalProducts / total) * 100,
    },
    {
      name: "Customers",
      value: (data.totalCustomers / total) * 100,
    },
    {
      name: "Sales",
      value: (data.totalSales / total) * 100,
    },
  ];

  return (
    <Layout>
      <div className="p-5 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Products */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg"
          >
            <h2 className="text-gray-500">Total Products</h2>
            <p className="text-3xl font-bold">{data.totalProducts}</p>
          </motion.div>

          {/* Customers */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg"
          >
            <h2 className="text-gray-500">Customers</h2>
            <p className="text-3xl font-bold">{data.totalCustomers}</p>
          </motion.div>

          {/* Sales */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg"
          >
            <h2 className="text-gray-500">Total Sales</h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ₹{data.totalSales}
            </p>
          </motion.div>
        </div>

        {/* EXTRA INDICATORS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="text-gray-500">Avg Sale / Customer</h3>
            <p className="text-xl font-semibold">₹{avgSale}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="text-gray-500">Stock Health</h3>
            <p
              className={`text-xl font-semibold ${
                stockHealth === "Low Stock" ? "text-red-500" : "text-green-500"
              }`}
            >
              {stockHealth}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h3 className="text-gray-500">Growth</h3>
            <p
              className={`text-xl font-semibold ${
                growthPercentage >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {growthPercentage}%
            </p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PIE CHART (Distribution) */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="mb-3 font-semibold">Distribution</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LINE CHART (Trend) */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="mb-3 font-semibold">Trend</h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AREA CHART */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="mb-3 font-semibold">Growth</h2>

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={growthData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="growth"
                  stroke="#f59e0b"
                  fill="#f59e0b33"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* SPEED METER */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="mb-3 font-semibold">Performance</h2>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <p className="text-lg font-bold text-green-500">
                {Math.min((data.totalSales / 100000) * 100, 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-500">Target Achieved</p>
            </div>

            <div className="text-center mt-2 font-semibold">
              ₹{data.totalSales}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* 🏆 TOP PRODUCTS */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Top Selling Products</h2>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="p-2">Product</th>
                  <th className="p-2">Sold</th>
                </tr>
              </thead>

              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="p-2">{p.name}</td>
                    <td className="p-2 font-semibold">{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🚨 LOW STOCK */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3 text-red-500">Low Stock Alert</h2>

            <ul className="space-y-2">
              {lowStock.map((p, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>{p.name}</span>
                  <span className="text-red-500 font-semibold">
                    {p.stock_quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
