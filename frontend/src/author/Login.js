import React, { useState } from "react";
import axios from "axios";
import { saveAuth } from "../services/authService";
import "./Login.css"; // CSS thuần

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Hiển thị thông báo đơn giản
    const showNotify = (message, success = true) => {
        const notify = document.getElementById("notify");
        notify.textContent = message;
        notify.style.background = success ? "#4CAF50" : "#f44336";
        notify.style.display = "block";
        setTimeout(() => (notify.style.display = "none"), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/login", {
                username,
                password,
            });

            if (res.data && res.data.token) {
                saveAuth(res.data);
                const roleName = res.data.roles[0]?.name || "USER";
                localStorage.setItem("role", roleName);

                showNotify("Đăng nhập thành công!");

                setTimeout(() => {
                    if (roleName === "ROLE_ADMIN") {
                        window.location.href = "/manage-orders";
                    } else {
                        window.location.href = "/orders";
                    }
                }, 1200);
            } else {
                showNotify("Sai tài khoản hoặc mật khẩu!", false);
            }
        } catch (err) {
            console.error(err);
            showNotify("Đăng nhập thất bại. Kiểm tra lại thông tin!", false);
        }
    };

    return (
        <div className="login-container">
            {/* Thông báo nổi */}
            <div id="notify"></div>

            <form onSubmit={handleLogin} className="login-form">
                <h2 className="login-title">Đăng nhập</h2>

                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                    required
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    required
                />

                <button type="submit" className="login-button">
                    Đăng nhập
                </button>

                <p className="login-text">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="login-link">
                        Đăng ký ngay
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Login;
