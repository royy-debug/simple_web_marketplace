import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

/* -------------------------------------------------------
   HELPER: Get Full Image URL
--------------------------------------------------------*/
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Jika sudah URL lengkap (http/https), langsung return
    if (imagePath.startsWith("http")) return imagePath;
    
    // Base URL backend Laravel (sesuaikan dengan env Anda)
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    
    // Jika path sudah include /storage, jangan tambah lagi
    if (imagePath.startsWith("/storage")) {
        return `${API_BASE}${imagePath}`;
    }
    
    // Tambahkan /storage/ untuk file dari Laravel storage
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${API_BASE}/storage${cleanPath}`;
};

/* -------------------------------------------------------
   FALLBACK IMAGE (placeholder online)
--------------------------------------------------------*/
const FALLBACK_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

/* -------------------------------------------------------
   PRODUCT CARD (Memoized)
--------------------------------------------------------*/
const ProductCard = memo(function ProductCard({ product, onOrder }) {
    return (
        <div
            className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer"
            onClick={() => onOrder(product)}
        >
            <img
                src={getImageUrl(product.image) || FALLBACK_IMAGE}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                    e.target.onerror = null; // Hindari infinite loop
                    e.target.src = FALLBACK_IMAGE;
                }}
            />

            <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition">
                {product.name}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description}
            </p>

            <p className="text-lg font-bold text-indigo-600 mb-4">
                Rp {Number(product.price).toLocaleString()}
            </p>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onOrder(product);
                }}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
                Order Sekarang →
            </button>
        </div>
    );
});

/* -------------------------------------------------------
   SKELETON LOADING
--------------------------------------------------------*/
const ProductSkeleton = () => (
    <div className="p-6 bg-white rounded-lg shadow animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
);

/* -------------------------------------------------------
   MAIN PRODUCTS COMPONENT
--------------------------------------------------------*/
export default function Products({ products: propProducts, isPreview = false }) {
    const [products, setProducts] = useState(propProducts || []);
    const [loading, setLoading] = useState(!propProducts);
    const navigate = useNavigate();

    /* ------------------------------------
       FETCH PRODUCTS (Only if no props)
    -------------------------------------*/
    useEffect(() => {
        // Jika props ada & ada isi → pakai props
        if (propProducts && propProducts.length > 0) {
            setProducts(propProducts);
            setLoading(false);
            return;
        }

        // Jika props undefined → halaman Products → fetch API
        if (propProducts === undefined) {
            api.get("/products")
                .then((res) => setProducts(res.data))
                .catch((err) => console.error("Error fetching products:", err))
                .finally(() => setLoading(false));
            return;
        }

        // Jika props ada tapi kosong → fetch API juga
        if (propProducts.length === 0) {
            api.get("/products")
                .then((res) => setProducts(res.data))
                .catch((err) => console.error("Error fetching products:", err))
                .finally(() => setLoading(false));
        }
    }, [propProducts]);

    /* ------------------------------------
       ORDER HANDLER
    -------------------------------------*/
    const handleOrder = useCallback(
        (product) => {
            navigate(`/order/${product.id}`, { state: { product } });
        },
        [navigate]
    );

    /* ------------------------------------
       LOADING STATE
    -------------------------------------*/
    if (loading) {
        return (
            <div className={isPreview ? "" : "container mx-auto py-20 px-4"}>
                {!isPreview && (
                    <h2 className="text-4xl font-bold mb-10 text-center">
                        Produk Kami
                    </h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: isPreview ? 4 : 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    /* ------------------------------------
       PREVIEW MODE (Landing Page)
    -------------------------------------*/
    if (isPreview) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onOrder={handleOrder}
                    />
                ))}
            </div>
        );
    }

    /* ------------------------------------
       FULL PAGE MODE
    -------------------------------------*/
    return (
        <div className="container mx-auto py-20 px-4">
            <h2 className="text-4xl font-bold mb-10 text-center">
                Produk Kami
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onOrder={handleOrder}
                    />
                ))}
            </div>
        </div>
    );
}