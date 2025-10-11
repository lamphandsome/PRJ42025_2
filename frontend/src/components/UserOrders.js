import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import InvoiceModal from "../components/InvoiceModal";
import "./UserOrders.css";

function UserOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    // Loading + modal thông báo
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [showAlertModal, setShowAlertModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) return;
        try {
            setLoading(true);
            const data = await orderService.getMyOrders(user.id);
            setOrders(data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setShowInvoiceModal(true);
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) {
            try {
                await orderService.deleteOrder(orderId);
                showAlert("Đã hủy đơn hàng thành công!");
                fetchOrders();
            } catch (error) {
                console.error("Lỗi khi hủy đơn hàng:", error);
                showAlert("Không thể hủy đơn hàng!");
            }
        }
    };

    const handleSendReview = async (orderId) => {
        if (!reviewText.trim()) {
            showAlert("Vui lòng nhập nội dung phản hồi!");
            return;
        }

        try {
            setActionLoadingId(orderId);
            const res = await orderService.sendFeedback(orderId, reviewText);

            // Cập nhật trạng thái đơn hàng để không hiển thị lại phản hồi
            setOrders((prev) =>
                prev.map((o) =>
                    o.id === orderId ? { ...o, hasFeedback: true } : o
                )
            );

            showAlert(res.message || "Cảm ơn bạn đã gửi phản hồi!");
            setReviewText("");
            setSelectedOrderId(null);
        } catch (error) {
            console.error("Lỗi khi gửi phản hồi:", error);
            showAlert("Không thể gửi phản hồi, vui lòng thử lại.");
        } finally {
            setActionLoadingId(null);
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setShowAlertModal(true);
    };

    const renderStatus = (status) => {
        switch (status) {
            case "Hoàn Tất":
                return <span className="badge success">Hoàn tất</span>;
            case "Đang Giặt":
                return <span className="badge warning">Đang giặt</span>;
            case "Đã Hủy":
                return <span className="badge danger">Đã hủy</span>;
            default:
                return <span className="badge gray">{status}</span>;
        }
    };

    return (
        <div className="orders-container">
            <h2 className="orders-title">Đơn hàng của tôi</h2>

            {loading && <div className="loading">Đang tải...</div>}

            <table className="orders-table">
                <thead>
                <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {orders.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="empty">
                            Không có đơn hàng nào
                        </td>
                    </tr>
                ) : (
                    orders.map((order) => (
                        <React.Fragment key={order.id}>
                            <tr>
                                <td>#{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.totalPrice.toLocaleString()} đ</td>
                                <td>{renderStatus(order.status)}</td>
                                <td>
                                    <button
                                        className="btn view"
                                        disabled={actionLoadingId === order.id}
                                        onClick={() => handleView(order)}
                                    >
                                        👁 Xem
                                    </button>

                                    {order.status !== "Hoàn Tất" &&
                                        order.status !== "Đã Hủy" && (
                                            <button
                                                className="btn cancel"
                                                onClick={() => handleCancelOrder(order.id)}
                                            >
                                                ❌ Hủy
                                            </button>
                                        )}

                                    {/* Chỉ hiển thị phản hồi nếu Hoàn tất & chưa phản hồi */}
                                    {order.status === "Hoàn Tất" && !order.hasFeedback && (
                                        <button
                                            className="btn review"
                                            onClick={() =>
                                                setSelectedOrderId(
                                                    selectedOrderId === order.id ? null : order.id
                                                )
                                            }
                                        >
                                            💬 Phản hồi
                                        </button>
                                    )}

                                    {order.hasFeedback && (
                                        <span className="badge success small">
        ✅ Đã phản hồi
    </span>
                                    )}

                                </td>
                            </tr>

                            {selectedOrderId === order.id && (
                                <tr className="review-row">
                                    <td colSpan="5">
                      <textarea
                          className="review-input"
                          placeholder="Nhập nội dung phản hồi của bạn..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          disabled={actionLoadingId === order.id}
                      />
                                        <div className="review-actions">
                                            <button
                                                className="btn send"
                                                disabled={actionLoadingId === order.id}
                                                onClick={() => handleSendReview(order.id)}
                                            >
                                                {actionLoadingId === order.id
                                                    ? "⏳ Đang gửi..."
                                                    : "📩 Gửi"}
                                            </button>
                                            <button
                                                className="btn cancel"
                                                onClick={() => setSelectedOrderId(null)}
                                            >
                                                ✖ Hủy
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))
                )}
                </tbody>
            </table>

            {/* Modal hoá đơn */}
            {showInvoiceModal && selectedOrder && (
                <InvoiceModal
                    order={selectedOrder}
                    onClose={() => setShowInvoiceModal(false)}
                    visible={showInvoiceModal}
                />
            )}

            {/* Modal thông báo tuỳ chỉnh */}
            {showAlertModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <p>{alertMessage}</p>
                        <button
                            className="btn close"
                            onClick={() => setShowAlertModal(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserOrders;
