import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get("/products", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const result =
      search.trim() === ""
        ? products
        : products.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [search, products]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Search + Add */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Product
        </button>
      </div>

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">Rp {Number(p.price).toLocaleString()}</td>
                  <td className="p-2">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
