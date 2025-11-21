import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import api from "../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal & form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    categories_id: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Search filter
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

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Modal Open
  const openAddModal = () => {
    setForm({ name: "", categories_id: "", price: "", stock: "", description: "", image: null });
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      categories_id: product.categories_id,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      image: null,
    });
    setShowEditModal(true);
  };

  // Handle Add - FIXED
  const handleAdd = async () => {
    try {
      // Validasi frontend
      if (!form.image || !(form.image instanceof File)) {
        alert("Gambar wajib diisi!");
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("categories_id", form.categories_id);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      formData.append("image", form.image, form.image.name); // Tambahkan nama file

      // Debug: cek isi FormData
      console.log("=== FormData Contents ===");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", // Explicit set
        },
      });

      console.log("Success:", response.data);
      setShowAddModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error response:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  // Handle Edit - FIXED
  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("categories_id", form.categories_id);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      
      if (form.image instanceof File) {
        formData.append("image", form.image, form.image.name);
      }

      const response = await api.post(`/products/${selectedProduct.id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Success:", response.data);
      setShowEditModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Error response:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk?")) return;
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk");
    }
  };

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
        <Button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Add Product
        </Button>
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
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">Rp {Number(p.price).toLocaleString()}</td>
                  <td className="p-2">{p.stock}</td>
                  <td className="p-2 flex gap-2">
                    <Button onClick={() => openEditModal(p)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</Button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modals */}
      {showAddModal && (
        <Modal title="Add Product" onClose={() => setShowAddModal(false)}>
          <ProductForm form={form} setForm={setForm} onSubmit={handleAdd} categories={categories} />
        </Modal>
      )}
      {showEditModal && (
        <Modal title="Edit Product" onClose={() => setShowEditModal(false)}>
          <ProductForm form={form} setForm={setForm} onSubmit={handleEdit} categories={categories} />
        </Modal>
      )}
    </div>
  );
}

// Modal
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-96 relative shadow-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-700">✕</button>
      </div>
    </div>
  );
}

// Product Form - FIXED dengan accept attribute
function ProductForm({ form, setForm, onSubmit, categories }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name, file.type, file.size);
      setForm({ ...form, image: file });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        value={form.categories_id || ""}
        onChange={(e) => setForm({ ...form, categories_id: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">--Select Category--</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input 
        type="text" 
        placeholder="Name" 
        className="border p-2 rounded" 
        value={form.name} 
        onChange={(e) => setForm({ ...form, name: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Price" 
        className="border p-2 rounded" 
        value={form.price} 
        onChange={(e) => setForm({ ...form, price: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Stock" 
        className="border p-2 rounded" 
        value={form.stock} 
        onChange={(e) => setForm({ ...form, stock: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Description" 
        className="border p-2 rounded" 
        value={form.description} 
        onChange={(e) => setForm({ ...form, description: e.target.value })} 
      />
      
      {/* File input dengan accept attribute */}
      <div>
        <input 
          type="file" 
          className="border p-2 rounded w-full" 
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
        />
        {form.image && (
          <p className="text-sm text-green-600 mt-1">
            ✓ File: {form.image.name}
          </p>
        )}
      </div>
      
      <Button onClick={onSubmit} className="mt-2 bg-blue-600 text-white hover:bg-blue-700">
        Save
      </Button>
    </div>
  );
}