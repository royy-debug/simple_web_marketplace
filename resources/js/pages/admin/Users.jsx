import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "../../components/services/api"; // pastikan api.js sudah ada

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers(res.data);
        } catch (err) {
            console.error("Fetch users error:", err.response?.data || err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading users...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users</h1>

            <Card>
                <CardHeader>
                    <CardTitle>User List</CardTitle>
                </CardHeader>

                <CardContent>
                    <table className="w-full text-left border">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b">
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
