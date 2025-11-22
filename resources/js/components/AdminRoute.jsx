import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    // Hanya admin yang boleh masuk
    return user.role === "admin" 
        ? <Outlet /> 
        : <Navigate to="/" replace />;
}
