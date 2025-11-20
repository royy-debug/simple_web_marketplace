import React from "react";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Footer from "./components/Footer";

const LandingPage = () => {
    return (
        <div className="font-sans">
            <Hero />
            <Products />
            <Orders />
            <Footer />
        </div>
    );
};

export default LandingPage;
