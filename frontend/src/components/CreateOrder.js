import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Table, Alert, Spinner } from 'react-bootstrap';
import orderService from '../services/orderService';
import InvoiceModal from './InvoiceModal';

const FIXED_ITEM_NAMES = [
  { label: 'Quần đùi', value: 'QUAN_DUI' },
  { label: 'Quần dài', value: 'QUAN_DAI' },
  { label: 'Đồ Lót', value: 'DO_LOT' },
  { label: 'Áo Phao', value: 'AO_PHAO' },
  { label: 'Áo Ngắn tay', value: 'AO_NGAN_TAY' },
  { label: 'Áo dài tay', value: 'AO_DAI_TAY' },
  { label: 'Chăn', value: 'CHAN' },
  { label: 'Đồ dùng khác', value: 'DO_DUNG_KHAC' }
];

const CreateOrder = () => {
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [serviceType, setServiceType] = useState('weight');
  const [items, setItems] = useState([{ name: '', quantity: 1 }]);
  const [weight, setWeight] = useState(0);
  const [note, setNote] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loadingType, setLoadingType] = useState(''); // 'preview' | 'save' | ''

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { name: '', quantity: 1 }]);

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const validateForm = () => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      setAlertMessage('Vui lòng nhập đầy đủ tên và số điện thoại khách hàng.');
      setAlertVariant('danger');
      return false;
    }
    if (!weight || weight <= 0) {
      setAlertMessage('Vui lòng nhập tổng cân nặng hợp lệ.');
      setAlertVariant('danger');
      return false;
    }
    if (items.some(item => !item.name.trim() || item.quantity <= 0)) {
      setAlertMessage('Vui lòng chọn món và nhập số lượng lớn hơn 0.');
      setAlertVariant('danger');
      return false;
    }
    return true;
  };

  const handlePreviewOrder = () => {
    if (!validateForm()) return;

    setLoadingType('preview');

    setTimeout(() => {
      const totalPrice = serviceType === 'monthly' ? 500000 : weight * 50000;
      const orderData = {
        customerName: customer.name,
        customerPhone: customer.phone,
        serviceType,
        items,
        weight,
        note,
        totalPrice,
      };
      setCreatedOrder(orderData);
      setShowInvoice(true);
      setLoadingType('');
    }, 800); // Giả lập loading ngắn
  };

  const handleSaveOrder = async () => {
    if (!validateForm()) return;

    setLoadingType('save');

    const totalPrice = serviceType === 'monthly' ? 500000 : weight * 50000;
    const orderData = {
      customerName: customer.name,
      customerPhone: customer.phone,
      serviceType,
      items,
      weight,
      note,
      totalPrice,
    };

    try {
      await orderService.createOrder(orderData);
      setAlertMessage('✅ Đơn hàng đã được lưu thành công và gửi thông báo cho khách hàng.');
      setAlertVariant('success');
      setCustomer({ name: '', phone: '' });
      setItems([{ name: '', quantity: 1 }]);
      setWeight(0);
      setNote('');
    } catch (error) {
      setAlertMessage('❌ Đã xảy ra lỗi khi lưu đơn hàng.');
      setAlertVariant('danger');
    } finally {
      setLoadingType('');
    }
  };

  return (
      <Container fluid className="create-order-container">
        <div className="page-header">
          <h2 className="page-title">Tạo Đơn Giặt Mới</h2>
          <p className="page-subtitle">Nhập thông tin chi tiết đơn hàng giặt ủi</p>
        </div>

        {alertMessage && <Alert variant={alertVariant} className="custom-alert">{alertMessage}</Alert>}

        <div className="form-card">
          <Form>
            <div className="section-header">
              <h5 className="section-title">👤 Thông tin khách hàng</h5>
            </div>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group controlId="customerName">
                  <Form.Label className="form-label">Tên Khách Hàng</Form.Label>
                  <Form.Control
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="form-input"
                      placeholder="Nhập tên khách hàng..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="customerPhone">
                  <Form.Label className="form-label">Số Điện Thoại</Form.Label>
                  <Form.Control
                      type="text"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="form-input"
                      placeholder="Nhập số điện thoại..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="section-header">
              <h5 className="section-title">🧺 Thông tin dịch vụ</h5>
            </div>
            <Form.Group controlId="serviceType" className="mb-4">
              <Form.Label className="form-label">Loại Dịch Vụ</Form.Label>
              <Form.Select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="form-input"
              >
                <option value="weight">Giặt Theo Cân</option>
                <option value="quantity">Giặt Theo Số Lượng</option>
                <option value="monthly">Giặt Theo Tháng</option>
              </Form.Select>
            </Form.Group>

            <div className="section-header">
              <h5 className="section-title">📋 Danh Sách Đồ</h5>
            </div>
            <div className="table-wrapper">
              <Table className="items-table">
                <thead>
                <tr>
                  <th>Tên Món</th>
                  <th>Số Lượng</th>
                  <th className="text-center">Hành Động</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select
                            value={item.name}
                            onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            className="form-input"
                        >
                          <option value="">-- Chọn món --</option>
                          {FIXED_ITEM_NAMES.map((opt, i) => (
                              <option key={i} value={opt.value}>{opt.label}</option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="form-input"
                        />
                      </td>
                      <td className="text-center">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            className="delete-item-btn"
                        >
                          🗑 Xóa
                        </Button>
                      </td>
                    </tr>
                ))}
                    </tbody>
              </Table>
              <Button variant="secondary" onClick={addItem} className="add-item-btn">
                + Thêm Món
              </Button>
            </div>

            <Row className="mt-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Tổng Cân Nặng (kg)</Form.Label>
                  <Form.Control
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="form-input"
                      placeholder="Nhập tổng cân nặng..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label className="form-label">Ghi chú đặc biệt (nếu có)</Form.Label>
              <Form.Control
                  as="textarea"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Giặt riêng áo phao, đồ dễ hỏng..."
                  className="form-input"
              />
            </Form.Group>

            <div className="action-buttons mt-4">
              <Button
                  variant="primary"
                  onClick={handlePreviewOrder}
                  disabled={loadingType === 'preview' || loadingType === 'save'}
                  className="preview-btn"
              >
                {loadingType === 'preview' ? (
                    <>
                      <Spinner animation="border" size="sm" /> Đang tạo đơn...
                    </>
                ) : (
                    '👁 Tạo Đơn Hàng'
                )}
              </Button>

              <Button
                  variant="success"
                  onClick={handleSaveOrder}
                  disabled={loadingType === 'save' || loadingType === 'preview'}
                  className="save-btn"
              >
                {loadingType === 'save' ? (
                    <>
                      <Spinner animation="border" size="sm" /> Đang lưu...
                    </>
                ) : (
                    '💾 Lưu Đơn Hàng'
                )}
              </Button>
            </div>
          </Form>
        </div>

        {showInvoice && createdOrder && (
            <InvoiceModal
                order={createdOrder}
                visible={showInvoice}
                onClose={() => setShowInvoice(false)}
            />
        )}
      </Container>
  );
};

export default CreateOrder;
