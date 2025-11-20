import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "../../components/services/api"; // <-- tambahkan ini


export default function Dashboard() {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        fetchCounts();
    }, []);

   async function fetchCounts() {
    try {
        // GET PRODUCT LIST
        const resProducts = await fetch("http://localhost:8000/api/products", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            }
        });

        const dataProducts = await resProducts.json();
        setTotalProducts(Array.isArray(dataProducts) ? dataProducts.length : 0);

        // GET USERS
        const resUsers = await api.get("/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTotalUsers(resUsers.data.length ?? 0);

        // GET ORDERS
        const resOrders = await api.get("/orders", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTotalOrders(resOrders.data.length ?? 0);

    } catch (err) {
        console.error("Dashboard fetch error:", err);
    }
}


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalProducts}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalUsers}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalOrders}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
