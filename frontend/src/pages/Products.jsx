import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

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
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/products/add",
      {
        name,
        price,
        stock_quantity: stock,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchProducts();
    setName("");
    setPrice("");
    setStock("");
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/products/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchProducts();
  };

  return (
    <Layout>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Products</h1>

        <div className="mb-5">
          <input
            placeholder="Product Name"
            className="border p-2 mr-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Price"
            className="border p-2 mr-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            placeholder="Stock"
            className="border p-2 mr-2"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <button onClick={addProduct} className="bg-green-500 text-white p-2">
            Add
          </button>
        </div>

        <table className="w-full bg-white rounded-xl shadow overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="text-center border-t">
                <td className="p-3">{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock_quantity}</td>
                <td>
                  <button
                    onClick={() => deleteProduct(p.id)}
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

export default Products;
