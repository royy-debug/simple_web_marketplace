import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { user } = useAuth();

    // Jika tidak login → ke login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
