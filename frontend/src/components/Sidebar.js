import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAuth, logout } from "../services/authService";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getAuth(); // lấy thông tin user từ localStorage

  const sidebarStyle = {
    width: "230px",
    height: "100vh",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #dee2e6",
    paddingTop: "30px",
    position: "fixed",
    top: 0,
    left: 0,
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: isActive ? "#fff" : "#333",
    backgroundColor: isActive ? "#0d6efd" : "transparent",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    margin: "4px 12px",
    transition: "all 0.2s ease-in-out",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
      <div style={sidebarStyle}>
        <h4 className="text-center mb-4 text-primary fw-bold">
          {user
              ? user.roles?.some((r) => r.name === "ROLE_ADMIN")
                  ? "Laundry Admin"
                  : "Laundry User"
              : "Laundry System"}
        </h4>

        <Nav className="flex-column">
          {user && (
              <>
                <NavLink to="/create-order" style={linkStyle}>
                  🧺 <span>Tạo đơn hàng</span>
                </NavLink>
                {user.roles?.some((r) => r.name === "ROLE_USER") && (
                    <>
                      <NavLink to="/orders" style={linkStyle}>
                        📋 <span>Quản lý đơn hàng</span>
                      </NavLink>
                    </>
                )}

                {user.roles?.some((r) => r.name === "ROLE_ADMIN") && (
                    <>
                      <NavLink to="/manage-orders" style={linkStyle}>
                        📋 <span>Quản lý đơn hàng</span>
                      </NavLink>
                      <NavLink to="/customers" style={linkStyle}>
                        👥 <span>Khách hàng</span>
                      </NavLink>
                      <NavLink to="/reports" style={linkStyle}>
                        📊 <span>Báo cáo</span>
                      </NavLink>
                    </>
                )}
              </>
          )}

          <div style={{ marginTop: "auto", padding: "20px" }}>
            {user ? (
                <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger w-100"
                >
                  🚪 Đăng xuất
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    className="btn btn-outline-primary w-100"
                >
                  🔐 Đăng nhập
                </button>
            )}
          </div>
        </Nav>
      </div>
  );
};

export default Sidebar;
