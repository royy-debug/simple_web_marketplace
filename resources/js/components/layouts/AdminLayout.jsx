import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LayoutDashboard, Boxes, Users, ShoppingCart } from "lucide-react";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper untuk active menu
  const isActive = (path) => location.pathname === path;

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // hapus token
    navigate("/login"); // redirect ke login
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col">
        <div className="mb-8 flex items-center gap-2">
          <LayoutDashboard size={28} className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              isActive("/admin")
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              isActive("/admin/products")
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <Boxes size={20} />
            Products
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              isActive("/admin/users")
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <Users size={20} />
            Users
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              isActive("/admin/orders")
                ? "bg-blue-600 text-white font-semibold"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            <ShoppingCart size={20} />
            Orders
          </Link>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <Menu size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
