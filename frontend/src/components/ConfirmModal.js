import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ open, onClose, onConfirm, orderId }) => {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận hoàn thành đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn đánh dấu đơn hàng <strong>#{orderId}</strong> là đã giặt xong?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Chưa giặt xong
        </Button>
        <Button variant="success" onClick={onConfirm}>
          Đã giặt xong
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
