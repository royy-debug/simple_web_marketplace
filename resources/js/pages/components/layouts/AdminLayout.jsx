import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Users,
  ShoppingCart,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/products", label: "Products", icon: <Boxes size={20} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { to: "/admin/orders", label: "Orders", icon: <ShoppingCart size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-xl border-r border-gray-200 flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <LayoutDashboard size={28} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-100 transition-all"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col mt-2 gap-2 px-1">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium ${
                isActive(item.to)
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {item.icon}
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-medium hover:bg-red-50 hover:text-red-600 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
