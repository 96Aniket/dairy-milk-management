import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

function Billing() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(res.data);
  };

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
    fetchProducts();
    fetchCustomers();
  }, []);

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const createBill = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/billing/create",
        {
          customer_id: selectedCustomer,
          items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Bill Created");
      console.log(res.data);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Billing</h1>

        <div className="bg-white p-5 rounded-xl shadow mb-4">
          <select
            className="border p-2 w-full mb-3 rounded"
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option>Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="mb-2">
            <select
              className="border p-2 mr-2"
              onChange={(e) =>
                handleChange(index, "product_id", e.target.value)
              }
            >
              <option>Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Stock: {p.stock_quantity})
                </option>
              ))}
            </select>

            <input
              type="number"
              className="border p-2"
              value={item.quantity}
              onChange={(e) =>
                handleChange(index, "quantity", e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={createBill}
          className="bg-green-500 text-white p-2"
        >
          Generate Bill
        </button>
      </div>
    </Layout>
  );
}

export default Billing;
