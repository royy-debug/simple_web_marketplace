import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

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
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
                loading="lazy"
                decoding="async"
                onError={(e) => (e.target.src = "/fallback.png")}
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
        if (propProducts && propProducts.length > 0) {
            setProducts(propProducts);
            setLoading(false);
            return;
        }

        if (!propProducts) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
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
