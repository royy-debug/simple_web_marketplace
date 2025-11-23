import Hero from "./Hero";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Products from "./ProductsPage";

export default function LandingPage({ featuredProducts = [] }) {

    const previewProducts = featuredProducts.slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Hero Section */}
            <div className="pb-10">
                <Hero />
            </div>

            {/* Products Preview */}
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

                    <Products products={previewProducts} isPreview={true} />

                    <div className="text-center mt-10">
                        <Link
                            to="/products"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
                        >
                            Lihat semua produk
                        </Link>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}
