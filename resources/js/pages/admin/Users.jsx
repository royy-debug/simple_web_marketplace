import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import api from "../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "buyer" // default role
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search filter
  useEffect(() => {
    const result = search.trim() === ""
      ? users
      : users.filter((u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          u.role.toLowerCase().includes(search.toLowerCase())
        );
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [search, users]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => setForm({ name: "", email: "", password: "", role: "buyer" });

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setForm({ 
      name: user.name, 
      email: user.email, 
      password: "", // password kosong saat edit
      role: user.role 
    });
    setShowEditModal(true);
  };

  const handleAdd = async () => {
    try {
      // Validasi form
      if (!form.name || !form.email || !form.password) {
        alert("Name, Email, and Password are required!");
        return;
      }

      await api.post("/users", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Add user error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  const handleEdit = async () => {
    if (!selectedUser) return;
    try {
      // Validasi form
      if (!form.name || !form.email) {
        alert("Name and Email are required!");
        return;
      }

      // Jika password kosong, tidak kirim password (tidak update)
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      
      if (form.password) {
        payload.password = form.password;
      }

      await api.put(`/users/${selectedUser.id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error("Edit user error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error editing user");
    }
  };

  const handleDelete = async (user) => {
    if (!user) return;
    if (!window.confirm(`Are you sure you want to delete "${user.name}"?`)) return;
    try {
      await api.delete(`/users/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  if (loading) return <p className="p-8">Loading users...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {/* Search + Add */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add User
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                currentData.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition-all">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-2 flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add User" onClose={() => setShowAddModal(false)}>
          <UserForm 
            form={form} 
            setForm={setForm} 
            onSubmit={handleAdd} 
            isEdit={false}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)}>
          <UserForm 
            form={form} 
            setForm={setForm} 
            onSubmit={handleEdit} 
            isEdit={true}
          />
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// User Form Component
function UserForm({ form, setForm, onSubmit, isEdit }) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          placeholder="Enter name"
          className="border p-2 rounded w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          placeholder="Enter email"
          className="border p-2 rounded w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password {isEdit ? "(leave empty to keep current)" : "*"}
        </label>
        <input
          type="password"
          placeholder={isEdit ? "Enter new password (optional)" : "Enter password"}
          className="border p-2 rounded w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
        <select
          className="border p-2 rounded w-full"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        onClick={onSubmit}
        className="w-full mt-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        {isEdit ? "Update User" : "Create User"}
      </button>
    </div>
  );
}