// constants.js

export const API_BASE_URL = 'http://localhost:8080';

export const WASHING_TYPES = {
  WEIGHT: 'THEO_CÂN',
  QUANTITY: 'THEO_SỐ_LƯỢNG',
  MONTHLY: 'THEO_THÁNG',
};

export const PRICE_PER_KG = 50000;       // 50.000 VNĐ / kg
export const PRICE_PER_ITEM = 10000;      // 5.000 VNĐ / món
export const MONTHLY_PRICE = 500000;     // 500.000 VNĐ / tháng

export const ORDER_STATUS = {
  PROCESSING: 'Đang Giặt',
  COMPLETED: 'Đã Giặt Xong',
};