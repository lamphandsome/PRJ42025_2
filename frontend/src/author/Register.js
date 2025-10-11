import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        fullname: "",
        email: "",
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const showNotify = (message, success = true) => {
        const notify = document.getElementById("notify");
        notify.textContent = message;
        notify.style.background = success ? "#4CAF50" : "#f44336";
        notify.style.display = "block";
        setTimeout(() => (notify.style.display = "none"), 3000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/register", user);
            if (res.status === 200) {
                showNotify("Đăng ký thành công!");
                setTimeout(() => (window.location.href = "/login"), 1500);
            } else {
                showNotify("Tên đăng nhập đã tồn tại!", false);
            }
        } catch (err) {
            showNotify("Đăng ký thất bại. Vui lòng thử lại!", false);
        }
    };

    return (
        <div className="register-container">
            {/* Thông báo nổi */}
            <div id="notify"></div>

            <form onSubmit={handleRegister} className="register-form">
                <h2 className="register-title">Đăng ký tài khoản</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Tên đăng nhập"
                    value={user.username}
                    onChange={handleChange}
                    className="register-input"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={user.password}
                    onChange={handleChange}
                    className="register-input"
                    required
                />

                <input
                    type="text"
                    name="fullname"
                    placeholder="Họ và tên"
                    value={user.fullname}
                    onChange={handleChange}
                    className="register-input"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={handleChange}
                    className="register-input"
                />

                <button type="submit" className="register-button">
                    Đăng ký
                </button>

                <p className="register-text">
                    Đã có tài khoản?{" "}
                    <a href="/login" className="register-link">
                        Đăng nhập
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Register;
