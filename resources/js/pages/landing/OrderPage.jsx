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

    const [quantity, setQuantity] = useState(1);
    const [paymentProof, setPaymentProof] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!product && id) {
            api.get(`/products/${id}`)
                .then((res) => setProduct(res.data))
                .catch(() => setError("Produk tidak ditemukan"))
                .finally(() => setLoading(false));
        }
    }, [id, product]);

    // ⬇⬇⬇ SUPPORT SEMUA JENIS FILE (image/pdf/docx/zip/video dll)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError("");
        setPaymentProof(file);

        // hanya preview jika image
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentProof) {
            setError("Harap upload bukti pembayaran");
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("product_id", product.id);
            formData.append("quantity", quantity);
            formData.append("payment_proof", paymentProof);
            formData.append("notes", notes);
            formData.append("total_price", product.price * quantity);

            await api.post("/orders", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccess(true);
            setTimeout(() => navigate("/orders"), 2000);

        } catch (err) {
            setError(err.response?.data?.message || "Gagal membuat pesanan.");
        } finally {
            setSubmitting(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
            </div>
        );
    }

    // Produk tidak ditemukan
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
                    <button
                        onClick={() => navigate("/products")}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                        Kembali ke Produk
                    </button>
                </div>
            </div>
        );
    }

    // Success
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        ✔
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h2>
                    <p className="text-gray-600">Mengalihkan ke halaman pesanan...</p>
                </div>
            </div>
        );
    }

    const totalPrice = product.price * quantity;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                
                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center mb-6 text-gray-600 hover:text-indigo-600"
                >
                    ← Kembali
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="md:flex">
                        
                        {/* PRODUCT INFO */}
                        <div className="md:w-1/2 p-6 bg-gray-50">
                            <img
                                src={product.image}
                                onError={(e) => (e.target.src = "/fallback.png")}
                                className="w-full h-64 object-cover rounded-xl"
                            />
                            <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
                            <p className="text-gray-600 mt-2">{product.description}</p>

                            <p className="text-3xl font-bold text-indigo-600 mt-4">
                                Rp {Number(product.price).toLocaleString()}
                            </p>
                        </div>

                        {/* ORDER FORM */}
                        <div className="md:w-1/2 p-6">
                            <h2 className="text-xl font-bold mb-6">Form Pemesanan</h2>

                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Quantity */}
                                <div>
                                    <label className="font-medium">Jumlah</label>
                                    <div className="flex items-center mt-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 bg-gray-100 rounded-lg"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-semibold w-12 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 bg-gray-100 rounded-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Upload */}
                                <div>
                                    <label className="font-medium">
                                        Bukti Pembayaran *
                                    </label>

                                    <div className="border-2 border-dashed border-gray-300 mt-2 rounded-xl p-5 text-center hover:border-indigo-400 transition">

                                        {previewImage ? (
                                            <div className="relative">
                                                <img
                                                    src={previewImage}
                                                    className="max-h-48 mx-auto rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPaymentProof(null);
                                                        setPreviewImage(null);
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block">
                                                <svg
                                                    className="w-12 h-12 text-gray-400 mx-auto mb-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-gray-500">Klik untuk upload file</p>
                                                <p className="text-xs text-gray-400">
                                                    Semua jenis file didukung (Max 5MB)
                                                </p>
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="font-medium">Catatan</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows="3"
                                        className="w-full border px-4 py-2 rounded-lg"
                                    ></textarea>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Total */}
                                <div className="border-t pt-5">
                                    <div className="flex justify-between text-lg mb-4">
                                        <span>Total Pembayaran</span>
                                        <span className="text-2xl font-bold text-indigo-600">
                                            Rp {totalPrice.toLocaleString()}
                                        </span>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {submitting ? "Memproses..." : "Konfirmasi Pesanan"}
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
