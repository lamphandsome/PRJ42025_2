import React, { useEffect, useState } from 'react';
import { Table, Container, Button, Form, Alert, Badge, Row, Col } from 'react-bootstrap';
import orderService from '../services/orderService';
import InvoiceModal from './InvoiceModal';
import ConfirmModal from './ConfirmModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

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
    <Container className="mt-4">
      <h2 className="mb-4">Quản Lý Đơn Hàng</h2>

      {alertMessage && (
        <Alert variant="success" onClose={() => setAlertMessage('')} dismissible>
          {alertMessage}
        </Alert>
      )}

      {/* Bộ lọc */}
      <Form className="mb-3">
        <Row className="g-3">
          <Col md={3}>
            <Form.Label>Hóa đơn số</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập mã đơn"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập SĐT"
              value={filterPhone}
              onChange={(e) => setFilterPhone(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Đang Giặt">Đang Giặt</option>
              <option value="Hoàn Tất">Hoàn Tất</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Hóa Đơn Số</th>
            <th>Tên Khách Hàng</th>
            <th>SĐT</th>
            <th>Ngày Đặt</th>
            <th>Trạng Thái</th>
            <th>Giá Tiền</th>
            <th>Chi Tiết</th>
            <th>Hoàn Thành</th>
            <th>Xoá</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.customerName}</td>
              <td>{order.customerPhone}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>{renderStatusBadge(order.status)}</td>
              <td>{order.totalPrice.toLocaleString()} đ</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewInvoice(order)}
                >
                  👁 Xem
                </Button>
              </td>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={order.status === 'Hoàn Tất'}
                  disabled={order.status === 'Hoàn Tất'}
                  onChange={() => handleConfirmFinish(order.id)}
                />
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleAskDelete(order.id)}
                  disabled={order.status === 'Hoàn Tất'}
                >
                  🗑 Xoá
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
