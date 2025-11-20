import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import api from "../api/api";

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>

          <CardContent>
            <table className="w-full text-left border">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition-all">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
