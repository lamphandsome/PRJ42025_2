import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaClipboardList, FaUsers, FaChartBar, FaSignOutAlt, FaSignInAlt, FaPlusCircle, FaTshirt } from "react-icons/fa";
import { getAuth, logout } from "../services/authService";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
      <div className="modern-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <FaTshirt className="logo-icon" />
          </div>
          <h4 className="sidebar-title">
            {user
                ? user.roles?.some((r) => r.name === "ROLE_ADMIN")
                    ? "Laundry Admin"
                    : "Laundry User"
                : "Laundry System"}
          </h4>
          {user && (
            <div className="user-info">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="user-details">
                <span className="user-name">{user.username}</span>
                <span className="user-role">
                  {user.roles?.some((r) => r.name === "ROLE_ADMIN") ? "Administrator" : "User"}
                </span>
              </div>
            </div>
          )}
        </div>

        <Nav className="sidebar-nav">
          {user && (
              <>
                <NavLink to="/create-order" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                  <FaPlusCircle className="nav-icon" />
                  <span>Tạo đơn hàng</span>
                </NavLink>
                
                {user.roles?.some((r) => r.name === "ROLE_USER") && (
                    <NavLink to="/orders" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                      <FaClipboardList className="nav-icon" />
                      <span>Quản lý đơn hàng</span>
                    </NavLink>
                )}

                {user.roles?.some((r) => r.name === "ROLE_ADMIN") && (
                    <>
                      <NavLink to="/manage-orders" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                        <FaClipboardList className="nav-icon" />
                        <span>Quản lý đơn hàng</span>
                      </NavLink>
                      <NavLink to="/customers" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                        <FaUsers className="nav-icon" />
                        <span>Khách hàng</span>
                      </NavLink>
                      <NavLink to="/reports" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
                        <FaChartBar className="nav-icon" />
                        <span>Báo cáo</span>
                      </NavLink>
                    </>
                )}
              </>
          )}
        </Nav>

        <div className="sidebar-footer">
          {user ? (
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt className="btn-icon" />
                <span>Đăng xuất</span>
              </button>
          ) : (
              <></>
              // <button onClick={handleLogin} className="login-btn">
              //   <FaSignInAlt className="btn-icon" />
              //   <span>Đăng nhập</span>
              // </button>
          )}
        </div>
      </div>
  );
};

export default Sidebar;
