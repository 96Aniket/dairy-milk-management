import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  // ✅ FETCH CUSTOMERS
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

  // ✅ ADD CUSTOMER
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
        }
      );

      toast.success("Customer Added ✅");

      fetchCustomers();
      setName("");
      setMobile("");
      setAddress("");
    } catch (err) {
      toast.error("Error adding customer ❌");
    }
  };

  // ✅ DELETE CUSTOMER
  const deleteCustomer = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/customers/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Customer Deleted 🗑️");
      fetchCustomers();
    } catch (err) {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <Layout>
      <div className="p-5">
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
            onClick={addCustomer}
            className="bg-green-500 text-white p-2"
          >
            Add
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
            {customers.map((c) => (
              <tr key={c.id} className="text-center border-t">
                <td className="p-3">{c.name}</td>
                <td>{c.mobile}</td>
                <td>{c.address}</td>
                <td>
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
      </div>
    </Layout>
  );
}

export default Customers;
