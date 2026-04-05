import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Billing() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewMode, setViewMode] = useState("new");

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
    fetchCustomers().then(() => fetchInvoices());
  }, []);

  const addItem = () => {
    setItems([...items, { product_id: "", quantity: 1 }]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const downloadPDF = async () => {
    const input = document.getElementById("invoice");

    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    pdf.save(
      selectedInvoice ? `invoice_${selectedInvoice.id}.pdf` : "invoice.pdf",
    );
  };

  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id == item.product_id);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/billing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoices(res.data || []);

      if (res.data && res.data.length > 0) {
        setSelectedInvoice(res.data[0]);
        setViewMode("old");
      }
    } catch (err) {
      console.log("Invoice Fetch Error:", err?.response?.data || err.message);
    }
  };

  const saveBill = async () => {
    if (!selectedCustomer || items.length === 0) {
      toast.error("Select customer and add items");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/billing/create",
        {
          customer_id: selectedCustomer,
          items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Invoice Saved");

      setItems([]);
      setSelectedCustomer("");

      setTimeout(() => {
        fetchInvoices();
      }, 300);
    } catch (err) {
      console.log("SAVE ERROR:", err?.response?.data || err.message);
      toast.error("Save failed");
    }
  };

  return (
    <Layout>
      <div className="p-5 bg-gray-100 dark:bg-gray-900 min-h-screen text-black dark:text-white">
        <h1 className="text-2xl font-bold mb-4">Billing</h1>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-4">
          <select
            className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
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
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
            />
          </div>
        ))}

        <div className="flex gap-3 mt-4">
          <button
            onClick={saveBill}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Invoice
          </button>

          <button
            onClick={downloadPDF}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-5">
          {/* LEFT - INVOICE LIST */}
          <div className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl shadow h-[500px] overflow-y-auto">
            <h2 className="font-bold mb-3">Invoices</h2>

            {/* New Invoice Button */}
            <div
              onClick={() => {
                setViewMode("new");
                setSelectedInvoice(null);
              }}
              className="p-2 mb-2 bg-green-500 text-white rounded cursor-pointer text-center"
            >
              + New Invoice
            </div>

            {invoices.map((inv) => (
              <div
                key={inv.id}
                onClick={() => {
                  setSelectedInvoice(inv);
                  setViewMode("old");
                }}
                className={`p-2 border-b cursor-pointer rounded mb-1
          ${selectedInvoice?.id === inv.id ? "bg-blue-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
        `}
              >
                <div className="font-semibold">#{inv.id}</div>
                <div className="text-sm">₹{inv.total_amount}</div>
              </div>
            ))}
          </div>

          {/* RIGHT - SINGLE INVOICE VIEW */}
          <div className="col-span-2">
            <div
              id="invoice"
              className="p-6 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow"
            >
              <h2 className="text-xl font-bold text-center mb-4 border-b pb-2">
                Invoice
              </h2>

              <div className="flex justify-between mb-4 text-sm">
                <p>
                  <b>Customer:</b>{" "}
                  {viewMode === "old"
                    ? customers.find(
                        (c) => c.id == selectedInvoice?.customer_id,
                      )?.name
                    : customers.find((c) => c.id == selectedCustomer)?.name}
                </p>

                <p>
                  <b>Date:</b>{" "}
                  {viewMode === "old"
                    ? new Date(selectedInvoice?.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>

              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-center">
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {viewMode === "new"
                    ? items.map((item, i) => {
                        const product = products.find(
                          (p) => p.id == item.product_id,
                        );
                        return (
                          <tr key={i} className="text-center">
                            <td className="border p-2">{product?.name}</td>
                            <td className="border p-2">{item.quantity}</td>
                            <td className="border p-2">₹{product?.price}</td>
                            <td className="border p-2">
                              ₹{(product?.price || 0) * item.quantity}
                            </td>
                          </tr>
                        );
                      })
                    : (selectedInvoice?.BillItems || []).map((item, i) => (
                        <tr key={i} className="text-center">
                          <td className="border p-2">{item.Product?.name}</td>
                          <td className="border p-2">{item.quantity}</td>
                          <td className="border p-2">₹{item.price}</td>
                          <td className="border p-2">
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>

              <div className="text-right mt-4 font-bold">
                Total: ₹
                {viewMode === "old" ? selectedInvoice?.total_amount : total}
              </div>

              <div className="flex gap-3 mt-4">
                {/* {viewMode === "new" && (
                  <button
                    onClick={saveBill}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                )} */}

                <button
                  onClick={downloadPDF}
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Billing;
