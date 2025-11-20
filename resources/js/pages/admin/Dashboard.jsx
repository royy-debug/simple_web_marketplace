import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import api from "../api/api"; // pastikan path benar
import { useNavigate } from "react-router-dom";
import { Boxes, Users, ShoppingCart } from "lucide-react";

export default function AdminDashboard() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCounts();
  }, []);

  async function fetchCounts() {
    try {
      const resProducts = await fetch("http://localhost:8000/api/products", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      const dataProducts = await resProducts.json();
      setTotalProducts(Array.isArray(dataProducts) ? dataProducts.length : 0);

      const resUsers = await api.get("/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTotalUsers(resUsers.data.length ?? 0);

      const resOrders = await api.get("/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTotalOrders(resOrders.data.length ?? 0);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  const cards = [
    {
      title: "Total Products",
      count: totalProducts,
      icon: <Boxes size={28} className="text-blue-500" />,
      link: "/admin/products",
      color: "blue",
    },
    {
      title: "Total Users",
      count: totalUsers,
      icon: <Users size={28} className="text-green-500" />,
      link: "/admin/users",
      color: "green",
    },
    {
      title: "Total Orders",
      count: totalOrders,
      icon: <ShoppingCart size={28} className="text-indigo-500" />,
      link: "/admin/orders",
      color: "indigo",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.link)}
            className={`cursor-pointer rounded-2xl shadow-md hover:shadow-xl border border-gray-200 p-6 transition-all transform hover:scale-105`}
          >
            <CardHeader className="flex items-center gap-4">
              {card.icon}
              <CardTitle className="text-lg font-semibold text-gray-700">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-5xl font-extrabold text-${card.color}-600`}>{card.count}</p>
              <p className="text-sm text-gray-400 mt-1">Click to view details</p>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  );
}
