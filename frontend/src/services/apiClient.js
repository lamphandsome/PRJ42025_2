// src/services/apiClient.js
const BASE_URL = 'http://localhost:8080/api';

async function request(url, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}), // tự động thêm token
    };

    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });

    // Nếu token hết hạn
    if (response.status === 401) {
        console.warn('Token hết hạn hoặc không hợp lệ');
        localStorage.removeItem('token');
        window.location.href = '/login'; // chuyển hướng về login
        return;
    }

    // Nếu lỗi khác
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Request failed');
    }

    return response.status === 204 ? null : await response.json();
}

export default request;
