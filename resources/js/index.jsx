import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/contexts/AuthContext";
import "../css/app.css";

// Landing Page
import LandingPage from "./pages/landing/LandingPage";
import ProductPage from "./pages/landing/ProductsPage";
import OrderPage from "./pages/landing/OrderPage";
import MyOrdersPage from "./pages/landing/MyOrdersPage";  // <-- TAMBAH INI


function LandingApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/order/:id" element={<OrderPage />} />
                <Route path="/orders" element={<MyOrdersPage />} />
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById("landing-root");

if (rootElement) {
    createRoot(rootElement).render(
        <AuthProvider>
            <LandingApp />
        </AuthProvider>
    );
}