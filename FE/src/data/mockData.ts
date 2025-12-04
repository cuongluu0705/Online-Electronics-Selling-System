import { Product, Order, User, AuditLog } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    model: 'A2849',
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 324,
    image: 'https://images.unsplash.com/photo-1658933161439-bbc61172d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MzcwMzI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    images: [
      'https://images.unsplash.com/photo-1658933161439-bbc61172d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MzcwMzI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    category: 'Smartphones',
    status: 'Active',
    stock: 45,
    specifications: {
      'Display': '6.7" Super Retina XDR',
      'Processor': 'A17 Pro chip',
      'RAM': '8GB',
      'Storage': '256GB',
      'Camera': '48MP Main + 12MP Ultra Wide',
      'Battery': '4422 mAh',
      'OS': 'iOS 17'
    },
    warranty: '1 Year',
    releaseYear: 2023,
    description: 'The ultimate iPhone with titanium design, advanced camera system, and powerful A17 Pro chip.'
  },
  {
    id: 'P002',
    name: 'MacBook Pro 16"',
    brand: 'Apple',
    model: 'MRW13',
    price: 2499,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlciUyMG1vZGVybnxlbnwxfHx8fDE3NjM3ODU3ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Computers',
    status: 'Active',
    stock: 23,
    specifications: {
      'Display': '16.2" Liquid Retina XDR',
      'Processor': 'M3 Pro',
      'RAM': '18GB',
      'Storage': '512GB SSD',
      'Graphics': 'Integrated GPU',
      'Battery': 'Up to 22 hours',
      'OS': 'macOS Sonoma'
    },
    warranty: '1 Year',
    releaseYear: 2023,
    description: 'Professional laptop with M3 Pro chip, stunning display, and all-day battery life.'
  },
  {
    id: 'P003',
    name: 'Samsung QLED 65" 4K TV',
    brand: 'Samsung',
    model: 'QN65Q80C',
    price: 1299,
    originalPrice: 1499,
    rating: 4.7,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1645736563824-c30a3c341fe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWxldmlzaW9uJTIwc2NyZWVuJTIwZGlzcGxheXxlbnwxfHx8fDE3NjM3MTA3MzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'TVs',
    status: 'Active',
    stock: 15,
    specifications: {
      'Screen Size': '65 inches',
      'Resolution': '4K UHD (3840 x 2160)',
      'Display Type': 'QLED',
      'Refresh Rate': '120Hz',
      'HDR': 'HDR10+',
      'Smart TV': 'Tizen OS',
      'Ports': '4 HDMI, 2 USB'
    },
    warranty: '2 Years',
    releaseYear: 2023,
    description: 'Immersive 4K QLED TV with Quantum HDR and advanced gaming features.'
  },
  {
    id: 'P004',
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    model: 'WH-1000XM5',
    price: 399,
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1572119244337-bcb4aae995af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW98ZW58MXx8fHwxNzYzNjgxNzA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Audio',
    status: 'Active',
    stock: 67,
    specifications: {
      'Type': 'Over-ear',
      'Connectivity': 'Bluetooth 5.2',
      'Noise Cancellation': 'Active',
      'Battery Life': 'Up to 30 hours',
      'Driver Size': '30mm',
      'Weight': '250g',
      'Charging': 'USB-C'
    },
    warranty: '1 Year',
    releaseYear: 2022,
    description: 'Industry-leading noise cancellation with premium sound quality and comfort.'
  },
  {
    id: 'P005',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    model: 'GPS 45mm',
    price: 429,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1668760180303-fcfe2b899e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjM2OTU0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Wearables',
    status: 'Active',
    stock: 89,
    specifications: {
      'Display': '1.9" Always-On Retina',
      'Processor': 'S9 SiP',
      'Case Size': '45mm',
      'Sensors': 'Heart rate, Blood oxygen, ECG',
      'Battery': 'Up to 18 hours',
      'Water Resistance': '50m',
      'Connectivity': 'GPS, Bluetooth, Wi-Fi'
    },
    warranty: '1 Year',
    releaseYear: 2023,
    description: 'Advanced smartwatch with health monitoring, fitness tracking, and seamless Apple ecosystem integration.'
  },
  {
    id: 'P006',
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    model: 'MHNK3',
    price: 1099,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1760708369071-e8a50a8979cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2UlMjBtb2Rlcm58ZW58MXx8fHwxNzYzNzE5MDEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Tablets',
    status: 'Active',
    stock: 34,
    specifications: {
      'Display': '12.9" Liquid Retina XDR',
      'Processor': 'M2 chip',
      'RAM': '8GB',
      'Storage': '256GB',
      'Camera': '12MP Wide + 10MP Ultra Wide',
      'Battery': 'Up to 10 hours',
      'Connectivity': 'Wi-Fi 6E, Bluetooth 5.3'
    },
    warranty: '1 Year',
    releaseYear: 2022,
    description: 'Powerful tablet with M2 chip and stunning XDR display for creative professionals.'
  },
  {
    id: 'P007',
    name: 'Canon EOS R6 Mark II',
    brand: 'Canon',
    model: 'EOS R6 II',
    price: 2499,
    rating: 4.9,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1597865927834-dfa12950143c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjM3NjIyNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Cameras',
    status: 'Active',
    stock: 12,
    specifications: {
      'Sensor': '24.2MP Full-Frame CMOS',
      'Processor': 'DIGIC X',
      'Video': '4K 60fps',
      'ISO Range': '100-102400',
      'Autofocus': 'Dual Pixel CMOS AF II',
      'Stabilization': '5-axis IBIS',
      'Connectivity': 'Wi-Fi, Bluetooth'
    },
    warranty: '2 Years',
    releaseYear: 2022,
    description: 'Professional mirrorless camera with advanced autofocus and exceptional low-light performance.'
  },
  {
    id: 'P008',
    name: 'PlayStation 5',
    brand: 'Sony',
    model: 'CFI-1215A',
    price: 499,
    rating: 4.9,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1695028644151-1ec92bae9fb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NjM3MzgwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Gaming',
    status: 'Active',
    stock: 28,
    specifications: {
      'CPU': 'AMD Zen 2',
      'GPU': 'AMD RDNA 2',
      'RAM': '16GB GDDR6',
      'Storage': '825GB SSD',
      'Resolution': 'Up to 8K',
      'Frame Rate': 'Up to 120fps',
      'Ray Tracing': 'Yes'
    },
    warranty: '1 Year',
    releaseYear: 2020,
    description: 'Next-gen gaming console with ultra-fast SSD and immersive gaming experience.'
  },
  {
    id: 'P009',
    name: 'AirPods Pro (2nd Gen)',
    brand: 'Apple',
    model: 'MQD83',
    price: 249,
    rating: 4.8,
    reviews: 789,
    image: 'https://images.unsplash.com/photo-1598371611276-1bc503a270a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MzY5ODUxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Audio',
    status: 'Active',
    stock: 123,
    specifications: {
      'Type': 'In-ear',
      'Connectivity': 'Bluetooth 5.3',
      'Noise Cancellation': 'Active',
      'Battery Life': 'Up to 6 hours',
      'Charging Case': 'Up to 30 hours total',
      'Water Resistance': 'IPX4',
      'Features': 'Spatial Audio, Adaptive Transparency'
    },
    warranty: '1 Year',
    releaseYear: 2022,
    description: 'Premium wireless earbuds with adaptive audio and superior noise cancellation.'
  },
  {
    id: 'P010',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    model: 'SM-S928',
    price: 1199,
    rating: 4.7,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1658933161439-bbc61172d86b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc2MzcwMzI0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Smartphones',
    status: 'Active',
    stock: 56,
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Storage': '256GB',
      'Camera': '200MP Main + 50MP Telephoto',
      'Battery': '5000 mAh',
      'OS': 'Android 14'
    },
    warranty: '1 Year',
    releaseYear: 2024,
    description: 'Flagship smartphone with S Pen, powerful camera system, and stunning display.'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customerId: 'C001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1-555-0123',
    items: [
      { productId: 'P001', productName: 'iPhone 15 Pro Max', quantity: 1, price: 1199 },
      { productId: 'P009', productName: 'AirPods Pro (2nd Gen)', quantity: 1, price: 249 }
    ],
    subtotal: 1448,
    discount: 50,
    total: 1398,
    recipientName: 'John Smith',
    recipientPhone: '+1-555-0123',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    note: 'Please call before delivery',
    status: 'Shipping',
    paymentMethod: 'COD',
    createdAt: '2024-11-20T10:30:00Z',
    updatedAt: '2024-11-21T14:20:00Z',
    estimatedDelivery: '2024-11-24'
  },
  {
    id: 'ORD-2024-002',
    customerId: 'C002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1-555-0456',
    items: [
      { productId: 'P003', productName: 'Samsung QLED 65" 4K TV', quantity: 1, price: 1299 }
    ],
    subtotal: 1299,
    discount: 0,
    total: 1299,
    recipientName: 'Sarah Johnson',
    recipientPhone: '+1-555-0456',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    note: '',
    status: 'Confirmed',
    paymentMethod: 'COD',
    createdAt: '2024-11-21T15:45:00Z',
    updatedAt: '2024-11-21T16:00:00Z',
    estimatedDelivery: '2024-11-25'
  }
];

export const mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Admin User',
    email: 'admin@electrostore.com',
    phone: '+1-555-1000',
    role: 'Admin',
    status: 'Active',
    createdAt: '2023-01-15T08:00:00Z'
  },
  {
    id: 'U002',
    name: 'Staff Member 1',
    email: 'staff1@electrostore.com',
    phone: '+1-555-2000',
    role: 'Staff',
    status: 'Active',
    createdAt: '2023-03-20T09:00:00Z'
  },
  {
    id: 'U003',
    name: 'Staff Member 2',
    email: 'staff2@electrostore.com',
    phone: '+1-555-2001',
    role: 'Staff',
    status: 'Active',
    createdAt: '2023-06-10T10:00:00Z'
  },
  {
    id: 'C001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    role: 'Customer',
    status: 'Active',
    createdAt: '2024-01-05T12:30:00Z'
  },
  {
    id: 'C002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0456',
    role: 'Customer',
    status: 'Active',
    createdAt: '2024-02-12T14:20:00Z'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    changedBy: 'admin@electrostore.com',
    timestamp: '2024-11-22T10:15:00Z',
    entity: 'Product',
    field: 'Price',
    previousValue: '$1299',
    newValue: '$1199'
  },
  {
    id: 'LOG-002',
    changedBy: 'staff1@electrostore.com',
    timestamp: '2024-11-21T16:30:00Z',
    entity: 'Product',
    field: 'Stock',
    previousValue: '50',
    newValue: '45'
  },
  {
    id: 'LOG-003',
    changedBy: 'admin@electrostore.com',
    timestamp: '2024-11-20T09:00:00Z',
    entity: 'System Settings',
    field: 'Delivery Fee',
    previousValue: '$15',
    newValue: '$10'
  }
];

export const categories = [
  { name: 'Smartphones', icon: '📱', count: 45 },
  { name: 'Computers', icon: '💻', count: 32 },
  { name: 'TVs', icon: '📺', count: 28 },
  { name: 'Audio', icon: '🎧', count: 67 },
  { name: 'Wearables', icon: '⌚', count: 54 },
  { name: 'Tablets', icon: '📱', count: 23 },
  { name: 'Cameras', icon: '📷', count: 19 },
  { name: 'Gaming', icon: '🎮', count: 41 }
];
