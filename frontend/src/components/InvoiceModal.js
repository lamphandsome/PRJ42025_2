import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const FIXED_ITEM_NAMES = {
  QUAN_DUI: 'Quần đùi',
  QUAN_DAI: 'Quần dài',
  DO_LOT: 'Đồ Lót',
  AO_PHAO: 'Áo Phao',
  AO_NGAN_TAY: 'Áo Ngắn tay',
  AO_DAI_TAY: 'Áo dài tay',
  CHAN: 'Chăn',
  DO_DUNG_KHAC: 'Đồ dùng khác'
};

const InvoiceModal = ({ visible, onClose, order }) => {
  if (!order) return null;

  const { customerName, customerPhone, orderDate, id, items = [], serviceType, weight, note } = order;

  const calculatePrice = () => {
    switch (serviceType) {
      case 'weight':
        return weight * 50000;
      case 'quantity':
        return items.reduce((acc, item) => acc + item.quantity, 0) * 5000;
      case 'monthly':
        return 500000;
      default:
        return 0;
    }
  };

  const serviceTypeLabel = {
    weight: 'Giặt Theo Cân',
    quantity: 'Giặt Theo Số Lượng',
    monthly: 'Giặt Theo Tháng'
  };

  const amount = calculatePrice();
  const bankCode = 'VPB';
  const accountNumber = '0979934306';
  const accountName = 'GIAT UI';
  const qrImageUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=Thanh+toan+don+hang+${id}&accountName=${accountName.replace(/ /g, '+')}`;

  return (
    <Modal show={visible} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Hóa Đơn Giặt Là - Đơn #{id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Ngày đặt:</strong> {new Date(orderDate).toLocaleDateString()}</p>
        <p><strong>Tên khách hàng:</strong> {customerName}</p>
        <p><strong>SĐT:</strong> {customerPhone}</p>
        <p><strong>Loại dịch vụ:</strong> {serviceTypeLabel[serviceType] || serviceType}</p>
        <p><strong>Cân nặng:</strong> {weight} kg</p>

        <Table bordered className="mt-3">
          <thead>
            <tr>
              <th>Tên món</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((item, idx) => (
              <tr key={idx}>
                <td>{FIXED_ITEM_NAMES[item.name] || item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="2" className="text-center">Không có món đồ nào</td>
              </tr>
            )}
          </tbody>
        </Table>

        <p className="mt-3"><strong>Tổng tiền:</strong> {amount.toLocaleString()} đ</p>

        <p className="mt-3"><strong>Lưu ý:</strong> {note && note.trim() ? note : 'Không có lưu ý gì đặc biệt.'}</p>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p><strong>Quét mã QR để thanh toán:</strong></p>
          <img
            src={qrImageUrl}
            alt="QR chuyển khoản"
            style={{ width: '220px', height: '220px' }}
          />
          <p className="text-muted mt-2">
            Nội dung chuyển khoản: <strong>Thanh toan don hang giat la {id}</strong>
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
        <Button variant="primary" onClick={() => window.print()}>In hóa đơn</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
