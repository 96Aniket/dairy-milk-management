import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    try {
      if (!name || !price) {
        alert("Name and Price required");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/products/add",
        {
          name,
          price: Number(price),
          stock_quantity: Number(stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchProducts();

      setName("");
      setPrice("");
      setStock("");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure?");
      if (!confirmDelete) return;

      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData({
      name: product.name,
      price: product.price,
      stock: product.stock_quantity,
    });
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/products/update/${editId}`,
        {
          name: editData.name,
          price: Number(editData.price),
          stock_quantity: Number(editData.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditId(null);
      fetchProducts();
    } catch (error) {
      alert("Update failed");
    }
  };

  return (
    <Layout>
      <div className="p-5 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        {/* ADD PRODUCT FORM */}
        <div className="mb-5 bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex flex-wrap gap-3">
          <input
            placeholder="Product Name"
            className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Price"
            type="number"
            className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Stock"
            type="number"
            className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 rounded"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <button
            onClick={addProduct}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>

        {/* TABLE */}
        <table className="w-full rounded-xl shadow overflow-hidden bg-white dark:bg-gray-800">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="text-center border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* NAME */}
                <td className="p-3">
                  {editId === p.id ? (
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded px-2 py-1 w-full"
                    />
                  ) : (
                    p.name
                  )}
                </td>

                {/* PRICE */}
                <td>
                  {editId === p.id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                      className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded px-2 py-1 w-20"
                    />
                  ) : (
                    <span className="font-medium text-green-600 dark:text-green-400">
                      ₹{p.price}
                    </span>
                  )}
                </td>

                {/* STOCK */}
                <td>
                  {editId === p.id ? (
                    <input
                      type="number"
                      value={editData.stock}
                      onChange={(e) =>
                        setEditData({ ...editData, stock: e.target.value })
                      }
                      className="border dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded px-2 py-1 w-20"
                    />
                  ) : (
                    <span className="font-semibold">{p.stock_quantity}</span>
                  )}
                </td>

                {/* ACTION */}
                <td>
                  <div className="flex justify-center gap-2">
                    {editId === p.id ? (
                      <button
                        onClick={updateProduct}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEdit(p)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Products;
