import './bootstrap'; // axios config
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./pages/contexts/AuthContext";

import '../css/app.css';

// Admin
import AdminLayout from "./pages/components/layouts/AdminLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";

// Component untuk update title berdasarkan route
function TitleUpdater() {
    const location = useLocation();
    
    useEffect(() => {
        const path = location.pathname;
        if (path === '/login') {
            document.title = 'MyStore - Login';
        } else if (path === '/register') {
            document.title = 'MyStore - Register';
        } else if (path.startsWith('/admin')) {
            document.title = 'Admin Panel';
        } else {
            document.title = 'MyStore';
        }
    }, [location]);
    
    return null;
}

function App() {
    return (
        <BrowserRouter>
            <TitleUpdater />
            <Routes>
                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

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
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById("root");

if (rootElement) {
    createRoot(rootElement).render(
        <AuthProvider>  
            <App />
        </AuthProvider>
    );
}