import { apiRequest } from './client';

export interface OrderItem {
  product_id: string | number;
  quantity: number;
}

export interface Order {
  items: OrderItem[];
}

export async function checkout(order: Order): Promise<void> {
  const token = localStorage.getItem('token') ?? '';
  await apiRequest<void>(
    'POST',
    '/buyer/orders/checkout',
    order,
    token
  );
}
