import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ roles }) => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    // nếu chưa đăng nhập
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // nếu có role yêu cầu và role không hợp lệ
    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }


    return <Outlet />;
};

export default PrivateRoute;
