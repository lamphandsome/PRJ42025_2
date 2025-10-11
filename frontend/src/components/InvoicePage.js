import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import InvoiceModal from './InvoiceModal';

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = await orderService.getOrders();
        const found = orders.find(o => String(o.id) === id);
        if (!found) {
          console.error('Không tìm thấy đơn hàng với id:', id);
          navigate('/'); // chuyển về trang chủ nếu không tìm thấy đơn
          return;
        }
        setOrder(found);
      } catch (error) {
        console.error('Lỗi khi tải đơn hàng:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  return (
    <div>
      <InvoiceModal visible={!loading && !!order} onClose={() => navigate('/')} order={order} />
    </div>
  );
};

export default InvoicePage;