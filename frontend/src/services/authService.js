// src/services/authService.js

// ====== Lưu thông tin đăng nhập (sau khi login) ======
export const saveAuth = (user) => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
    if (user.token) {
        localStorage.setItem("token", user.token);
    }
};

// ====== Lấy thông tin người dùng hiện tại ======
export const getAuth = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// ====== Lấy token hiện tại ======
export const getToken = () => {
    return localStorage.getItem("token");
};

// ====== Xóa thông tin đăng nhập (đăng xuất) ======
export const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login"; // tự động chuyển về trang login
};

// ====== Kiểm tra đã đăng nhập chưa ======
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};
