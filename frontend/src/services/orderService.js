// src/services/orderService.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { getToken } from './authService';

const BASE_URL = 'http://localhost:8080/api/orders';

// Hàm tiện ích tự động thêm Authorization header
const authHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const handleResponse = async (response, errorMessage) => {
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${errorMessage}: ${text}`);
    }
    if (response.status !== 204) {
        return await response.json();
    }
    return null;
};

const orderService = {
    /** 🧺 Tạo đơn hàng mới */
    createOrder: async (orderData) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(orderData),
            });
            return await handleResponse(response, 'Failed to create order');
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    /** 📦 Lấy tất cả đơn hàng (admin) */
    getOrders: async () => {
        try {
            const response = await fetch(BASE_URL, {
                headers: authHeaders(),
            });
            return await handleResponse(response, 'Failed to fetch orders');
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    /** 👤 Lấy đơn hàng theo userId */
    getMyOrders: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/${userId}`, {
                headers: authHeaders(),
            });
            return await handleResponse(response, 'Failed to fetch user orders');
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    },

    /** ✅ Đánh dấu đơn hàng đã hoàn tất */
    markOrderAsCompleted: async (orderId) => {
        try {
            const response = await fetch(`${BASE_URL}/${orderId}/complete`, {
                method: 'PUT',
                headers: authHeaders(),
            });
            return await handleResponse(response, 'Failed to complete order');
        } catch (error) {
            console.error('Error marking order as completed:', error);
            throw error;
        }
    },

    /** ❌ Xóa (hoặc hủy) đơn hàng */
    deleteOrder: async (orderId) => {
        try {
            const response = await fetch(`${BASE_URL}/${orderId}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });
            await handleResponse(response, 'Failed to delete order');
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    },

    /** 💬 Gửi phản hồi cho đơn hàng */
    sendFeedback: async (orderId, content) => {
        try {
            const response = await fetch(`http://localhost:8080/api/feedback/${orderId}`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ content }),
            });
            return await handleResponse(response, 'Failed to send feedback');
        } catch (error) {
            console.error('Error sending feedback:', error);
            throw error;
        }
    },
};

export default orderService;
