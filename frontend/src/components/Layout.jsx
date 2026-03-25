import { Link } from "react-router-dom";
import { Home, Package, Users, FileText } from "lucide-react";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-xl font-bold mb-6">Dairy Admin</h1>

        <nav className="flex flex-col gap-3">
          <Link to="/dashboard" className="flex gap-2">
            <Home size={18} /> Dashboard
          </Link>

          <Link to="/products" className="flex gap-2">
            <Package size={18} /> Products
          </Link>

          <Link to="/billing" className="flex gap-2">
            <FileText size={18} /> Billing
          </Link>

          <Link to="/customers" className="flex gap-2">
            <Users size={18} /> Customers
          </Link>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-5">

        {/* TOPBAR */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">Welcome Admin</h2>
          <button className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Layout;
