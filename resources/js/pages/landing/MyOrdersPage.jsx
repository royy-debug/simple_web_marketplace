import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/my-orders");
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Gagal memuat pesanan");
        } finally {
            setLoading(false);
        }
    };

    /** STATUS BADGE */
    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Menunggu Pembayaran" },
            paid: { bg: "bg-blue-100", text: "text-blue-800", label: "Sudah Dibayar" },
            completed: { bg: "bg-green-100", text: "text-green-800", label: "Selesai" },
            canceled: { bg: "bg-red-100", text: "text-red-800", label: "Dibatalkan" },
        };

        const s = statusMap[status] || statusMap.pending;

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>
                {s.label}
            </span>
        );
    };

    /** STATUS ICON */
    const getStatusIcon = (status) => {
        const iconBase = "w-10 h-10 rounded-full flex items-center justify-center";

        switch (status) {
            case "pending":
                return (
                    <div className={`${iconBase} bg-yellow-100`}>
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                );

            case "paid":
                return (
                    <div className={`${iconBase} bg-blue-100`}>
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                );

            case "completed":
                return (
                    <div className={`${iconBase} bg-green-100`}>
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                );

            case "canceled":
                return (
                    <div className={`${iconBase} bg-red-100`}>
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* NAVBAR */}
           
            {/* CONTENT */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Pesanan Saya</h1>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <EmptyOrderState />
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} getStatusBadge={getStatusBadge} getStatusIcon={getStatusIcon} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/** KOMPONEN TERPISAH = BERSIH */
function EmptyOrderState() {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Belum ada pesanan</h2>
            <p className="text-gray-500 mb-6">Yuk mulai belanja!</p>
            <Link to="/products" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
                Lihat Produk
            </Link>
        </div>
    );
}

/** CARD */
function OrderCard({ order, getStatusBadge, getStatusIcon }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                            <p className="text-sm text-gray-500">Order #{order.id}</p>
                            <p className="text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                    {getStatusBadge(order.status)}
                </div>

                {/* ITEMS */}
                <div className="border-t border-b py-4 my-4">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-2">
                            <img
                                src={item.product?.image || "/fallback.png"}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => (e.target.src = "/fallback.png")}
                            />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.product?.name}</p>
                                <p className="text-sm text-gray-500">x{item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-800">
                                Rp {Number(item.price).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between">
                    <div />
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Pembayaran</p>
                        <p className="text-xl font-bold text-indigo-600">
                            Rp {Number(order.total_price).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* TIMELINE */}
            <OrderTimeline status={order.status} />
        </div>
    );
}

/** TIMELINE BARU TANPA SHIPPED */
/** TIMELINE BARU TANPA SHIPPED */
function OrderTimeline({ status }) {
    const steps = ["pending", "paid", "completed"];
    const labels = {
        pending: "Pending",
        paid: "Dibayar",
        completed: "Selesai"
    };

    return (
        <div className="bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between text-xs">
                {steps.map((s, i) => (
                    <React.Fragment key={s}>
                        <StatusStep 
                            status={s} 
                            currentStatus={status} 
                            label={labels[s]} 
                        />
                        {i < steps.length - 1 && (
                            <div className="flex-1 h-1 bg-gray-200 mx-2">
                                <div 
                                    className={`h-full ${
                                        steps.indexOf(status) > i 
                                            ? "bg-indigo-600" 
                                            : "bg-gray-200"
                                    }`} 
                                />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

/** STATUS STEP */
function StatusStep({ status, currentStatus, label }) {
    const steps = ["pending", "paid", "completed"];
    const activeIndex = steps.indexOf(currentStatus);
    const index = steps.indexOf(status);

    const isPassed = index <= activeIndex;
    const isActive = currentStatus === status;

    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${isPassed ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}
                    ${isActive ? "ring-2 ring-indigo-300" : ""}
                `}
            >
                {isPassed ? "✓" : index + 1}
            </div>
            <span className={`mt-1 ${isActive ? "text-indigo-600 font-medium" : "text-gray-500"}`}>
                {label}
            </span>
        </div>
    );
}
