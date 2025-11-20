import React, { useEffect, useState } from "react";
import api from "../../components/services/api"; // pastikan path sesuai
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";

export default function Products() {
    /* ========================= STATES ========================= */
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    // Add/Edit form
    const [form, setForm] = useState({
        name: "",
        categories_id: "",
        price: "",
        stock: "",
        description: "",
        image: ""
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    /* ========================= FETCH DATA ========================= */
    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const res = await api.get("/products", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
            setProducts(res.data);
            setFilteredProducts(res.data);
        } catch (error) {
            console.error("Fetch error:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    }

    /* ========================= SEARCH FILTER ========================= */
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

    /* ========================= PAGINATION ========================= */
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentData = filteredProducts.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    /* ========================= CRUD LOGIC ========================= */
    const resetForm = () => {
        setForm({
            name: "",
            categories_id: "",
            price: "",
            stock: "",
            description: "",
            image: ""
        });
    };

    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setForm({
            name: product.name,
            categories_id: product.categories_id,
            price: product.price,
            stock: product.stock,
            description: product.description,
            image: product.image
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    // Add product
async function handleAdd() {
    try {
        const fd = new FormData();
        Object.keys(form).forEach((key) => {
            fd.append(key, form[key]);
        });

        await api.post("/products", fd, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                // Jangan set Content-Type, biarkan axios otomatis men-set multipart/form-data
            },
        });

        setShowAddModal(false);
        fetchProducts();
    } catch (err) {
        console.error("Add error:", err.response?.data || err);
        alert("Error adding product");
    }
}

    // Edit product
    const handleEdit = async () => {
        if (!selectedProduct) return;

        const token = localStorage.getItem("token");

        try {
            await api.put(`/products/${selectedProduct.id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setShowEditModal(false);
            fetchProducts();
            alert("Product updated!");
        } catch (error) {
            console.log("Edit error:", error.response?.data || error);
            alert("Gagal update product!");
        }
    };

    // Delete product
    async function handleDelete() {
        if (!selectedProduct) return;

        try {
            await api.delete(`/products/${selectedProduct.id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });

            setShowDeleteModal(false);
            fetchProducts();
            alert("Product deleted!");
        } catch (err) {
            console.error("Delete error:", err.response?.data || err);
            alert("Error deleting product");
        }
    }

    if (loading) return <p>Loading...</p>;

    /* ========================= MAIN UI ========================= */
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Products</h1>

            {/* Search + Add Button */}
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search product..."
                    className="border p-2 rounded w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    onClick={openAddModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
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
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.map((p) => (
                                <tr key={p.id} className="border-b">
                                    <td className="p-2">{p.name}</td>
                                    <td className="p-2">
                                        Rp {Number(p.price).toLocaleString()}
                                    </td>
                                    <td className="p-2">{p.stock}</td>

                                    <td className="p-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => openDeleteModal(p)}
                                            className="px-3 py-1 bg-red-600 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4 gap-2">
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="px-4 py-2">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(p + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* ========================= MODALS ========================= */}
            {showAddModal && (
                <Modal
                    title="Add Product"
                    onClose={() => setShowAddModal(false)}
                >
                    <ProductForm
                        form={form}
                        setForm={setForm}
                        onSubmit={handleAdd}
                    />
                </Modal>
            )}

            {showEditModal && (
                <Modal
                    title="Edit Product"
                    onClose={() => setShowEditModal(false)}
                >
                    <ProductForm
                        form={form}
                        setForm={setForm}
                        onSubmit={handleEdit} // panggil tanpa argumen, gunakan selectedProduct.id
                    />
                </Modal>
            )}

            {showDeleteModal && (
                <Modal
                    title="Delete Product"
                    onClose={() => setShowDeleteModal(false)}
                >
                    <p>
                        Are you sure you want to delete{" "}
                        <b>{selectedProduct?.name}</b>?
                    </p>

                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/* ========================= REUSABLE MODAL ========================= */
function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                {children}

                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

/* ========================= PRODUCT FORM ========================= */
function ProductForm({ form, setForm, onSubmit }) {
    return (
        <div>
            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Name"
                    className="border p-2 rounded"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Category ID"
                    className="border p-2 rounded"
                    value={form.categories_id}
                    onChange={(e) =>
                        setForm({ ...form, categories_id: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Price"
                    className="border p-2 rounded"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Stock"
                    className="border p-2 rounded"
                    value={form.stock}
                    onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                    }
                />

                <textarea
                    placeholder="Description"
                    className="border p-2 rounded"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <input
                    type="text"
                    placeholder="Image URL"
                    className="border p-2 rounded"
                    value={form.image}
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                    }
                />
            </div>

            <button
                onClick={onSubmit}
                className="w-full mt-4 bg-green-600 text-white p-2 rounded"
            >
                Save
            </button>
        </div>
    );
}
