import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "../components/ui/card";

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setOrders(res.data ?? []);
        } catch (err) {
            console.error("Orders Fetch Error:", err);
        }
    }

    // DELETE ORDER (ADMIN ONLY)
    async function deleteOrder(id) {
        if (!confirm("Hapus pesanan ini?")) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            fetchOrders();
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin — Orders</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                </CardHeader>

                <CardContent>
                    <table className="w-full text-left border">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">User</th>
                                <th className="p-2">Product</th>
                                <th className="p-2">Qty</th>
                                <th className="p-2">Total</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="border-b">
                                    <td className="p-2">{o.user?.name}</td>

                                    <td className="p-2">
                                        {o.items.map(i => i.product.name).join(", ")}
                                    </td>

                                    <td className="p-2">
                                        {o.items
                                            .map(i => i.quantity)
                                            .reduce((a, b) => a + b, 0)}
                                    </td>

                                    <td className="p-2">
                                        Rp {o.total_price.toLocaleString()}
                                    </td>

                                    <td className="p-2">
                                        <span
                                            className={`px-2 py-1 rounded text-white ${
                                                o.status === "pending"
                                                    ? "bg-yellow-500"
                                                    : o.status === "paid"
                                                    ? "bg-blue-600"
                                                    : o.status === "completed"
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                            }`}
                                        >
                                            {o.status}
                                        </span>
                                    </td>

                                    <td className="p-2 flex gap-2">
                                        <button
                                            onClick={() => deleteOrder(o.id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
