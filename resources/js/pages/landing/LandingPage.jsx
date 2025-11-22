import Hero from "./Hero";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Products from "./ProductsPage"; // import biasa, tapi sudah memoized

export default function LandingPage({ featuredProducts = [] }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            logout();
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            logout();
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    // Hanya 4 produk untuk landing page
    const previewProducts = featuredProducts.slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Navigation */}
            <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        <span className="text-2xl font-bold text-indigo-600">MyStore</span>

                        <div className="flex items-center gap-6">
                            {user ? (
                                <>
                                    <Link to="/orders" className="text-gray-700 hover:text-indigo-600 transition font-medium">
                                        My Orders
                                    </Link>

                                    <Link
                                        to="/products"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
                                    >
                                        Shop Now
                                    </Link>

                                    <button 
                                        onClick={handleLogout}
                                        className="text-gray-700 hover:text-red-600 transition font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition font-medium">
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pb-10">
                <Hero />
            </div>

            {/* Products Preview Section */}
            <section id="products" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Featured Products
                        </h2>
                        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                            Discover our most popular items — log in to explore complete collections!
                        </p>
                    </div>

                    {/* Products Grid (Preview 4) */}
                    <Products products={previewProducts} isPreview={true} />

                    {/* CTA: See All Products */}
                    <div className="text-center mt-10">
                        <Link
                            to="/products"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
                        >
                            See All Products
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
