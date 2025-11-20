import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";

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

            // Pastikan API mengembalikan array orders
            setOrders(res.data ?? []);
        } catch (err) {
            console.error("Orders fetch error:", err);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Orders</h1>

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
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="border-b">
                                    <td className="p-2">{o.user.name}</td>
                                    <td className="p-2">{o.items.map(i => i.product.name).join(", ")}</td>
                                    <td className="p-2">{o.items.map(i => i.quantity).reduce((a,b) => a+b, 0)}</td>
                                    <td className="p-2">Rp {o.total_price.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
