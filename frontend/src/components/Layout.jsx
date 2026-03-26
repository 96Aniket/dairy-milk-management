import { NavLink } from "react-router-dom";
import { Home, Package, Users, FileText } from "lucide-react";
import { useState } from "react";

function Layout({ children }) {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

        {/* SIDEBAR */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5">
          <h1 className="text-xl font-bold mb-6">Dairy Admin</h1>

          <nav className="flex flex-col gap-3">

            {/* Dashboard */}
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <Home size={18} /> Dashboard
            </NavLink>

            {/* Products */}
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <Package size={18} /> Products
            </NavLink>

            {/* Billing */}
            <NavLink
              to="/billing"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <FileText size={18} /> Billing
            </NavLink>

            {/* Customers */}
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <Users size={18} /> Customers
            </NavLink>

          </nav>
        </div>

        {/* MAIN */}
        <div className="flex-1 p-5">

          {/* TOPBAR */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">Welcome Admin</h2>

            <div className="flex gap-3">
              {/* 🌙 Dark Mode Toggle */}
              <button
                onClick={() => setDark(!dark)}
                className="bg-gray-800 text-white px-3 py-1 rounded"
              >
                🌙
              </button>

              {/* Logout */}
              <button className="bg-red-500 text-white px-3 py-1 rounded">
                Logout
              </button>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
