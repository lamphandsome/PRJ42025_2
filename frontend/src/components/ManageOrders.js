import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Form, Alert, Badge, Row, Col } from 'react-bootstrap';
import orderService from '../services/orderService';
import InvoiceModal from './InvoiceModal';
import ConfirmModal from './ConfirmModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import './ManageOrders.css';

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  // Bộ lọc
  const [filterId, setFilterId] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      const sortedData = data.sort((a, b) => b.id - a.id);
      setOrders(sortedData);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    }
  };

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleConfirmFinish = (orderId) => {
    setCurrentOrderId(orderId);
    setShowConfirmModal(true);
  };

  const handleFinishOrder = async () => {
    try {
      await orderService.markOrderAsCompleted(currentOrderId);
      setShowConfirmModal(false);
      setAlertMessage('Đơn hàng chuyển trạng thái thành công và gửi tin nhắn tới khách hàng.');
      fetchOrders();
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  const handleAskDelete = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await orderService.deleteOrder(orderToDelete);
      setShowDeleteModal(false);
      setAlertMessage('Đơn hàng đã được xoá thành công.');
      fetchOrders();
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (error) {
      console.error("Lỗi khi xoá đơn hàng:", error);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Hoàn Tất':
        return <Badge bg="success">Hoàn Tất</Badge>;
      case 'Đang Giặt':
        return <Badge bg="warning" text="dark">Đang Giặt</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Áp dụng bộ lọc
  const filteredOrders = orders.filter(order => {
    const matchesId = filterId ? order.id.toString().includes(filterId) : true;
    const matchesPhone = filterPhone ? order.customerPhone.includes(filterPhone) : true;
    const matchesStatus = filterStatus ? order.status === filterStatus : true;
    return matchesId && matchesPhone && matchesStatus;
  });

  return (
    <Container fluid className="manage-orders-container">
      <div className="page-header">
        <h2 className="page-title">Quản Lý Đơn Hàng</h2>
        <p className="page-subtitle">Theo dõi và quản lý tất cả đơn hàng giặt ủi</p>
      </div>

      {alertMessage && (
        <Alert variant="success" onClose={() => setAlertMessage('')} dismissible className="custom-alert">
          {alertMessage}
        </Alert>
      )}

      {/* Bộ lọc */}
      <div className="filter-card">
        <h5 className="filter-title">🔍 Bộ lọc tìm kiếm</h5>
        <Form>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label className="filter-label">Hóa đơn số</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã đơn..."
                value={filterId}
                onChange={(e) => setFilterId(e.target.value)}
                className="filter-input"
              />
            </Col>
            <Col md={4}>
              <Form.Label className="filter-label">Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập SĐT..."
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                className="filter-input"
              />
            </Col>
            <Col md={4}>
              <Form.Label className="filter-label">Trạng thái</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-input"
              >
                <option value="">Tất cả</option>
                <option value="Đang Giặt">Đang Giặt</option>
                <option value="Hoàn Tất">Hoàn Tất</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>
      </div>

      <div className="table-card">
        <Table hover responsive className="modern-table">
          <thead>
            <tr>
              <th>Hóa Đơn Số</th>
              <th>Tên Khách Hàng</th>
              <th>SĐT</th>
              <th>Ngày Đặt</th>
              <th>Trạng Thái</th>
              <th>Giá Tiền</th>
              <th className="text-center">Chi Tiết</th>
              <th className="text-center">Hoàn Thành</th>
              <th className="text-center">Xoá</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td className="customer-name">{order.customerName}</td>
                <td>{order.customerPhone}</td>
                <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                <td>{renderStatusBadge(order.status)}</td>
                <td className="price-cell">{order.totalPrice.toLocaleString()} đ</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleViewInvoice(order)}
                    className="action-btn view-btn"
                  >
                    👁 Xem
                  </Button>
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={order.status === 'Hoàn Tất'}
                    disabled={order.status === 'Hoàn Tất'}
                    onChange={() => handleConfirmFinish(order.id)}
                    className="custom-checkbox"
                  />
                </td>
                <td className="text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleAskDelete(order.id)}
                    disabled={order.status === 'Hoàn Tất'}
                    className="action-btn delete-btn"
                  >
                    🗑 Xoá
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {showInvoiceModal && selectedOrder && (
        <InvoiceModal
          order={selectedOrder}
          onClose={() => setShowInvoiceModal(false)}
          visible={showInvoiceModal}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          open={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleFinishOrder}
          orderId={currentOrderId}
        />
      )}

      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        orderId={orderToDelete}
      />
    </Container>
  );
}

export default ManageOrders;
