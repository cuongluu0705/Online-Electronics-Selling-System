import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Product, CartItem, Order, User, AuditLog } from './types';
import { mockOrders, mockUsers, mockAuditLogs, mockProducts } from './data/mockData';
import { login } from './api/auth';
import { toast, Toaster } from 'sonner'; 

// Components & Pages
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { ProductListingPage } from './components/pages/ProductListingPage';
import { ProductDetailsPage } from './components/pages/ProductDetailsPage';
import { CartPage } from './components/pages/CartPage';
import { CheckoutPage } from './components/pages/CheckoutPage';
import { OrderConfirmationPage } from './components/pages/OrderConfirmationPage';
import { OrderStatusPage } from './components/pages/OrderStatusPage';

import { StaffLoginPage } from './components/staff/StaffLoginPage';
import { StaffLayout } from './components/staff/StaffLayout';
import { ProductManagementPage } from './components/staff/ProductManagementPage';
import { ProductModificationPage } from './components/staff/ProductModificationPage';
import { OrderManagementPage } from './components/staff/OrderManagementPage';

import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { UserManagementPage } from './components/admin/UserManagementPage';
import { SystemSettingsPage } from './components/admin/SystemSettingsPage';

import { TemplatePreviewPage } from './components/templates/TemplatePreviewPage';
import { UnifiedLoginPage } from './components/UnifiedLoginPage';
import { RegisterPage } from './components/pages/RegisterPage'; 
import { Button } from './components/ui/button'; 

const API_BASE = 'http://localhost:8000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('oss_token') || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as any),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  
  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    console.error("API Error:", data);
    throw new Error(data?.detail ?? data?.message ?? `HTTP ${res.status}`);
  }
  return data as T;
}

export const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

function normalizeStatusToFE(status?: string): 'Active' | 'Inactive' {
  const s = (status || '').toLowerCase();
  if (s === 'inactive' || s === 'deactivated' || s === 'disabled') return 'Inactive';
  return 'Active';
}
function normalizeStatusToAPI(status: string): string {
  return status === 'Inactive' ? 'Deactivated' : 'Active';
}

const mapApiProductToFE = (p: any): Product => {
  let category = 'Accessories';
  const id = String(p.productId).toUpperCase();
  const name = String(p.productName).toLowerCase();

  if (id.startsWith('PH_') || name.includes('phone') || name.includes('iphone') || name.includes('galaxy')) {
    category = 'Smartphones';
  } else if (id.startsWith('LP_') || name.includes('laptop') || name.includes('macbook')) {
    category = 'Laptops';
  } else if (id.startsWith('TV_') || name.includes('tv') || name.includes('smart')) {
    category = 'TVs';
  } else if (name.includes('watch') || name.includes('đồng hồ')) {
    category = 'Watches';
  } else if (name.includes('camera') || name.includes('máy ảnh')) {
    category = 'Cameras';
  }

  const timestamp = new Date().getTime();

  return {
    id: String(p.productId),
    name: p.productName,
    brand: p.brand || 'Unknown',
    price: Number(p.price || 0),
    originalPrice: Number(p.price || 0) * 1.1, 
    rating: 4.5,
    reviews: 10,
    image: p.imageBaseUrl 
      ? `${API_BASE}${p.imageBaseUrl}?v=${timestamp}` 
      : 'https://placehold.co/600x400?text=No+Image',
    images: [],
    category: category, 
    status: normalizeStatusToFE(p.status),
    stock: Number(p.quantity || 0),
    specifications: p.specification ? { "Details": p.specification } : {},
    warranty: p.warrantyPeriod ? `${p.warrantyPeriod} months` : '12 months',
    releaseYear: p.releaseDate ? new Date(p.releaseDate).getFullYear() : 2024,
    description: p.specification || 'No description available',
    model: p.productId
  };
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ElectroStoreApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [staffProducts, setStaffProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null);
  
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [buyerId, setBuyerId] = useState<number>(1);

  const fetchProducts = async (query: string = '') => {
    try {
      const url = query ? `/buyer/products?q=${encodeURIComponent(query)}` : '/buyer/products';
      const list = await apiFetch<any[]>(url, { method: 'GET' });
      setProducts(list.map(mapApiProductToFE));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
  const currentQuery = new URLSearchParams(location.search).get('q') || '';
  fetchProducts(currentQuery);

  const intervalId = setInterval(() => {
    if (!location.pathname.startsWith('/staff') && !location.pathname.startsWith('/admin')) {
       const queryNow = new URLSearchParams(window.location.search).get('q') || '';

       fetchProducts(queryNow); 
    }
  }, 5000); 

  return () => clearInterval(intervalId);
}, [location.pathname, location.search]);

useEffect(() => {
  if (user && buyerId) {
    const savedCart = localStorage.getItem(`oss_cart_${buyerId}`);
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng", e);
      }
    } else {
      setCart([]);
    }
  }
}, [user, buyerId]);

useEffect(() => {
  if (user && buyerId) {
    localStorage.setItem(`oss_cart_${buyerId}`, JSON.stringify(cart));
  }
}, [cart, user, buyerId]);

  const handleSearch = async (query: string) => {
    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  const refreshStaffProducts = async () => {
    try {
      const list = await apiFetch<any[]>('/staff/products', { method: 'GET' });
      setStaffProducts(list.map(mapApiProductToFE));
    } catch (err: any) {
      toast.error(`Error loading products: ${err.message}`);
    }
  };

  const addStaffProduct = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('oss_token') || '';
      const res = await fetch(`${API_BASE}/staff/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Add failed');
      }

      await Promise.all([
        refreshStaffProducts(),
        fetchProducts()        
      ]);
      
      toast.success("Product added successfully!");
    } catch (err: any) {
      toast.error(`Failed to add product: ${err.message}`);
    }
  };

  const updateStaffProduct = async (id: string, formData: FormData) => {
    try {
      const token = localStorage.getItem('oss_token') || '';
      
      const res = await fetch(`${API_BASE}/staff/products/${id}`, {
        method: 'PUT', 
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Update failed');
      }

      await Promise.all([
        refreshStaffProducts(),
        fetchProducts()
      ]);

      toast.success("Product updated successfully!");
    } catch (err: any) {
      toast.error(`Failed to update product: ${err.message}`);
    }
  };

  const toggleStaffProductStatus = async (id: string) => {
    try {
      const product = staffProducts.find(p => p.id === id);
      if (!product) return;
      const nextStatus = product.status === 'Active' ? 'Inactive' : 'Active';
      const apiStatus = normalizeStatusToAPI(nextStatus);
      await apiFetch(`/staff/products/${id}/update_product_status`, {
        method: 'PUT',
        body: JSON.stringify({ status: apiStatus })
      });
      await refreshStaffProducts();
      toast.success(`Product status changed to ${nextStatus}!`);
    } catch (err: any) {
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  const addToCart = (product: Product & { quantity?: number }) => {
    const quantityToAdd = product.quantity || 1;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + quantityToAdd;
        const finalQuantity = Math.min(newQuantity, product.stock);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: finalQuantity } : item
        );
      }
      const { quantity, ...cleanProduct } = product;
      return [...prev, { product: cleanProduct as Product, quantity: quantityToAdd }];
    });
    toast.success(`Added ${quantityToAdd} x ${product.name} to cart`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    if (!window.confirm("Remove item from cart?")) return;
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const placeOrder = async (orderData: any) => {
    try {
      const payload = {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        recipientName: orderData.recipientName,
        recipientPhone: orderData.recipientPhone,
        address: orderData.address,
        note: orderData.note || '',
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        customerId: buyerId
      };

      const resp = await apiFetch<any>('/buyer/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success(`Order placed! Total: ${formatVND(resp.total)}`);
      setCart([]);
      
      const confirmedOrder: Order = {
        id: resp.id,
        customerId: String(buyerId),
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        recipientName: resp.recipientName,
        recipientPhone: resp.recipientPhone,
        address: resp.address,
        note: orderData.note,
        items: resp.items.map((i: any) => ({
             productId: i.productId,
             productName: i.productName,
             price: i.unitPrice,
             quantity: i.quantity,
             lineTotal: i.lineTotal
        })),
        subtotal: resp.subtotal,
        discount: resp.discount,
        total: resp.total,
        status: 'Pending',
        paymentMethod: 'COD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3*86400000).toISOString()
      };

      navigate('/order-confirmation', { state: { order: confirmedOrder } });

    } catch (err: any) {
      toast.error(`Order failed: ${err.message}`);
    }
  };

  const handleLogin = async (email: string, pass: string, role: 'buyer' | 'staff' | 'admin') => {
    try {
      const resp = await login(email, pass, role);
      if (resp.access_token) localStorage.setItem('oss_token', resp.access_token);
      
      if (resp.role === 'buyer') {
        setUser({ name: resp.name || resp.username, email: resp.username, role: 'buyer' });
        setBuyerId(resp.userId);
        toast.success(`Welcome back, ${resp.name || resp.username}!`);
        navigate('/');
      } else if (resp.role === 'staff') {
        setIsStaffLoggedIn(true);
        await refreshStaffProducts();
        navigate('/staff/products');
      } else if (resp.role === 'admin') {
        setIsAdminLoggedIn(true);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      throw err; 
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsStaffLoggedIn(false);
    setIsAdminLoggedIn(false);
    setCart([]);
    localStorage.removeItem('oss_token');
    toast.info("You have been logged out");
    navigate('/');
  };

  const legacyNavigate = (page: string, data?: any) => {
    if (page === 'home') navigate('/');
    else if (page === 'products') {
      const search = data?.category ? `?category=${data.category}` : '';
      navigate(`/products${search}`);
    }
    else if (page === 'product-details') navigate(`/product/${data.productId}`);
    else if (page === 'cart') navigate('/cart');
    else if (page === 'checkout') navigate('/checkout');
    else if (page === 'login') navigate('/login');
    else if (page === 'staff-login') navigate('/staff-login');
    else if (page === 'admin-login') navigate('/admin-login');
  };

  const showPortalSwitcher = !user && !isStaffLoggedIn && !isAdminLoggedIn;

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      
      <Routes>
        <Route path="/" element={<><Header cartItemCount={cart.reduce((s, i) => s + i.quantity, 0)} onNavigate={legacyNavigate} user={user} onLogout={handleLogout} onSearch={handleSearch} /><HomePage products={products} onNavigate={legacyNavigate} onAddToCart={addToCart} /><Footer /></>} />
        <Route path="/products" element={<><Header cartItemCount={cart.reduce((s, i) => s + i.quantity, 0)} onNavigate={legacyNavigate} user={user} onLogout={handleLogout} onSearch={handleSearch} /><ProductListingPage products={products} onNavigate={legacyNavigate} onAddToCart={addToCart} initialCategory={new URLSearchParams(location.search).get('category') || undefined} /><Footer /></>} />
        <Route path="/product/:id" element={<ProductDetailsWrapper products={products} addToCart={addToCart} navigate={legacyNavigate} cartCount={cart.length} user={user} logout={handleLogout} />} />
        <Route path="/cart" element={<><Header cartItemCount={cart.reduce((s, i) => s + i.quantity, 0)} onNavigate={legacyNavigate} user={user} onLogout={handleLogout} onSearch={handleSearch} /><CartPage cartItems={cart} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} onNavigate={legacyNavigate} /><Footer /></>} />
        <Route path="/checkout" element={<><Header cartItemCount={cart.reduce((s, i) => s + i.quantity, 0)} onNavigate={legacyNavigate} user={user} onLogout={handleLogout} onSearch={handleSearch} /><CheckoutPage cartItems={cart} onPlaceOrder={placeOrder} /><Footer /></>} />
        <Route path="/order-confirmation" element={<OrderConfirmationWrapper navigate={legacyNavigate} />} />
        <Route path="/order-status" element={<div className="p-8 text-center">Order Status Page (WIP)</div>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<UnifiedLoginPage onLogin={(email, pass) => handleLogin(email, pass, 'buyer')} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/staff-login" element={<StaffLoginPage onLogin={(email, pass) => handleLogin(email, pass, 'staff')} />} />
        <Route path="/admin-login" element={<AdminLoginPage onLogin={(email, pass) => handleLogin(email, pass, 'admin')} />} />

        <Route path="/staff/*" element={
          isStaffLoggedIn ? (
            <StaffLayout currentPage={location.pathname.split('/').pop() || 'dashboard'} onNavigate={(p) => navigate(`/staff/${p.replace('staff-', '')}`)} onLogout={handleLogout}>
              <Routes>
                <Route path="products" element={<ProductManagementPage products={staffProducts} onAddProduct={addStaffProduct} onUpdateProduct={updateStaffProduct} onToggleStatus={toggleStaffProductStatus} />} />
                <Route path="product-modification" element={<ProductModificationPage products={staffProducts} onAddProduct={addStaffProduct} onUpdateProduct={updateStaffProduct} onDeleteProduct={(id) => toggleStaffProductStatus(id)} />} />
                <Route path="orders" element={<OrderManagementPage orders={orders} onUpdateOrderStatus={() => {}} />} />
              </Routes>
            </StaffLayout>
          ) : <Navigate to="/staff-login" />
        } />

        <Route path="/admin/*" element={
          isAdminLoggedIn ? (
            <AdminLayout currentPage={location.pathname.split('/').pop() || 'dashboard'} onNavigate={(p) => navigate(`/admin/${p.replace('admin-', '')}`)} onLogout={handleLogout}>
              <Routes>
                <Route path="users" element={<UserManagementPage users={users} onAddUser={()=>{}} onUpdateUser={()=>{}} onToggleStatus={()=>{}} />} />
                <Route path="settings" element={<SystemSettingsPage auditLogs={auditLogs} onUpdateSetting={()=>{}} />} />
              </Routes>
            </AdminLayout>
          ) : <Navigate to="/admin-login" />
        } />
      </Routes>

      {showPortalSwitcher && (
        <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
          <Button size="sm" onClick={() => navigate('/login')}>Login (Customer)</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/staff-login')}>Staff Portal</Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/admin-login')}>Admin Portal</Button>
        </div>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
}

const ProductDetailsWrapper = ({ products, addToCart, navigate, cartCount, user, logout }: any) => {
  const loc = useLocation();
  const id = loc.pathname.split('/').pop();
  const product = products.find((p: Product) => p.id === id);

  if (!product) return <div>Product not found</div>;

  return (
    <>
      <Header cartItemCount={cartCount} onNavigate={navigate} user={user} onLogout={logout} />
      <ProductDetailsPage 
        product={product} 
        relatedProducts={products.slice(0, 4)} 
        onAddToCart={addToCart} 
        onNavigate={navigate} 
      />
      <Footer />
    </>
  );
};

const OrderConfirmationWrapper = ({ navigate }: any) => {
  const { state } = useLocation();
  if (!state?.order) return <Navigate to="/" />;
  return <OrderConfirmationPage order={state.order} onNavigate={navigate} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ElectroStoreApp />
    </BrowserRouter>
  );
}