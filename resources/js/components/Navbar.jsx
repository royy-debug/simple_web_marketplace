import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../pages/contexts/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            logout();
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            logout();
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
                    >
                        MyStore
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">

                        {/* Show common links for all users */}
                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-indigo-600 font-medium transition"
                        >
                            Products
                        </Link>

                        {user ? (
                            <>
                                {/* My Orders for logged in users */}
                                <Link
                                    to="/orders"
                                    className="text-gray-700 hover:text-indigo-600 transition font-medium"
                                >
                                    My Orders
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 transition font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-indigo-600 font-medium transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
