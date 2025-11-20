import './bootstrap'; // Import axios config
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../css/app.css';
import AdminLayout from "./components/layouts/AdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Admin Routes */}
                <Route 
                    path="/admin" 
                    element={
                        <AdminLayout>
                            <Dashboard />
                        </AdminLayout>
                    } 
                />
                <Route
                    path="/admin/products"
                    element={
                        <AdminLayout>
                            <Products />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <AdminLayout>
                            <Users />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <AdminLayout>
                            <Orders />
                        </AdminLayout>
                    }
                />
                
                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById("root");
if (rootElement) {
    createRoot(rootElement).render(<App />);
}