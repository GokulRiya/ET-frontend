import { isAuthenticated } from "../services/authService";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default PublicRoute