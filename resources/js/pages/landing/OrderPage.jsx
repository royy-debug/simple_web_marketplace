import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function OrderPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(location.state?.product || null);
    const [loading, setLoading] = useState(!location.state?.product);
    const [submitting, setSubmitting] = useState(false);
    
    // Form state
    const [quantity, setQuantity] = useState(1);
    const [paymentProof, setPaymentProof] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Fetch product if not passed via state
    useEffect(() => {
        if (!product && id) {
            api.get(`/products/${id}`)
                .then((res) => {
                    setProduct(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching product:", err);
                    setError("Produk tidak ditemukan");
                })
                .finally(() => setLoading(false));
        }
    }, [id, product]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                setError("Format file harus JPG, PNG, atau WebP");
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Ukuran file maksimal 5MB");
                return;
            }
            
            setError("");
            setPaymentProof(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!paymentProof) {
            setError("Harap upload bukti pembayaran");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("product_id", product.id);
            formData.append("quantity", quantity);
            formData.append("payment_proof", paymentProof);
            formData.append("notes", notes);
            formData.append("total_price", product.price * quantity);

            await api.post("/orders", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess(true);
            
            // Redirect to orders after 2 seconds
            setTimeout(() => {
                navigate("/orders");
            }, 2000);
            
        } catch (err) {
            console.error("Order failed:", err);
            setError(err.response?.data?.message || "Gagal membuat pesanan. Silakan coba lagi.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Produk tidak ditemukan</h2>
                    <button
                        onClick={() => navigate("/products")}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Kembali ke Produk
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h2>
                    <p className="text-gray-600">Mengalihkan ke halaman pesanan...</p>
                </div>
            </div>
        );
    }

    const totalPrice = product.price * quantity;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Kembali
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        
                        {/* Product Info */}
                        <div className="md:w-1/2 p-6 bg-gray-50">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-64 object-cover rounded-xl mb-6"
                                onError={(e) => (e.target.src = "/fallback.png")}
                            />
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <p className="text-3xl font-bold text-indigo-600">
                                Rp {Number(product.price).toLocaleString()}
                            </p>
                        </div>

                        {/* Order Form */}
                        <div className="md:w-1/2 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Form Pemesanan</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                
                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jumlah
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Proof Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bukti Pembayaran <span className="text-red-500">*</span>
                                    </label>
                                    
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition">
                                        {previewImage ? (
                                            <div className="relative">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="max-h-48 mx-auto rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPaymentProof(null);
                                                        setPreviewImage(null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full hover:bg-red-600 transition"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block">
                                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                                <p className="text-gray-500 mb-1">Klik untuk upload gambar</p>
                                                <p className="text-xs text-gray-400">JPG, PNG, WebP (Max 5MB)</p>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Catatan (Opsional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="Tambahkan catatan untuk pesanan..."
                                    ></textarea>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Total & Submit */}
                                <div className="border-t pt-5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600">Total Pembayaran</span>
                                        <span className="text-2xl font-bold text-indigo-600">
                                            Rp {totalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Memproses...
                                            </span>
                                        ) : (
                                            "Konfirmasi Pesanan"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}