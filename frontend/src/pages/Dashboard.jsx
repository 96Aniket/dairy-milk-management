import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Layout from "../components/Layout";

function Dashboard() {
  const [data, setData] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSales: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await axios.get("http://localhost:5000/api/dashboard");
    setData(res.data);
  };

  const chartData = [
    { name: "Products", value: data.totalProducts },
    { name: "Customers", value: data.totalCustomers },
    { name: "Sales", value: data.totalSales },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-5">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2>Total Products</h2>
          <p className="text-2xl">{data.totalProducts}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <h2>Customers</h2>
          <p className="text-2xl">{data.totalCustomers}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <h2>Sales</h2>
          <p className="text-2xl text-green-600">₹{data.totalSales}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-5 shadow rounded">
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>
    </Layout>
  );
}

export default Dashboard;
