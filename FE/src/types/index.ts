export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  category: string;
  status: 'Active' | 'Inactive';
  stock: number;
  specifications: Record<string, string>;
  warranty: string;
  releaseYear: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  recipientName: string;
  recipientPhone: string;
  address: string;
  note: string;
  status: 'Placed' | 'Confirmed' | 'Shipping' | 'Delivered' | 'Cancelled';
  paymentMethod: 'COD';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Customer' | 'Staff' | 'Admin';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  changedBy: string;
  timestamp: string;
  entity: string;
  field: string;
  previousValue: string;
  newValue: string;
}

export interface FilterOptions {
  brands: string[];
  priceRange: [number, number];
  warranty: string[];
  releaseYear: number[];
  specifications: Record<string, string[]>;
}
