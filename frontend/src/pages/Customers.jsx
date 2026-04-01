import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCustomers = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const editCustomer = (customer) => {
    setName(customer.name);
    setMobile(customer.mobile);
    setAddress(customer.address);
    setEditingId(customer.id);
  };

  const updateCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/customers/update/${editingId}`,
        {
          name,
          mobile,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Customer Updated");

      setEditingId(null);
      setName("");
      setMobile("");
      setAddress("");

      fetchCustomers();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile?.includes(search),
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const addCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/customers/add",
        {
          name,
          mobile,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Customer Added");

      fetchCustomers();
      setName("");
      setMobile("");
      setAddress("");
    } catch (err) {
      toast.error("Error adding customer");
    }
  };

  const exportToExcel = () => {
    // 🔥 export filtered + paginated data (ya full filtered)
    const dataToExport = filteredCustomers.map((c) => ({
      Name: c.name,
      Mobile: c.mobile,
      Address: c.address,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "customers_report.xlsx");
  };

  const deleteCustomer = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/customers/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Customer Deleted");
      fetchCustomers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout>
      <div className="p-5">
        <input
          placeholder="Search by name or mobile..."
          className="border p-2 mb-3 w-full rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={exportToExcel}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-3"
        >
          Download Excel
        </button>
        <h1 className="text-2xl font-bold mb-4">Customers</h1>

        {/* FORM */}
        <div className="mb-5">
          <input
            placeholder="Customer Name"
            className="border p-2 mr-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Mobile"
            className="border p-2 mr-2"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <input
            placeholder="Address"
            className="border p-2 mr-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            onClick={editingId ? updateCustomer : addCustomer}
            className={`text-white p-2 ${
              editingId ? "bg-blue-500" : "bg-green-500"
            }`}
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentCustomers.map((c) => (
              <tr key={c.id} className="text-center border-t">
                <td className="p-3">{c.name}</td>
                <td>{c.mobile}</td>
                <td>{c.address}</td>
                <td>
                  <button
                    onClick={() => editCustomer(c)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCustomer(c.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Customers;
