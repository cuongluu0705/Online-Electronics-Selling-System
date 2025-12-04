import { useState } from 'react';
import { CartItem } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onPlaceOrder: (orderData: any) => void;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function CheckoutPage({ cartItems, onPlaceOrder }: CheckoutPageProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    recipientName: '',
    recipientPhone: '',
    address: '',
    note: ''
  });
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Logic giảm giá khớp với CartPage: > 10 triệu giảm 500k
  const discountThreshold = 10000000;
  const discountValue = 500000;
  const discount = subtotal > discountThreshold ? discountValue : 0;
  
  const total = subtotal - discount;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({
      ...formData,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      subtotal,
      discount,
      total
    });
  };
  
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Customer Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      required
                      value={formData.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      required
                      value={formData.customerEmail}
                      onChange={(e) => updateField('customerEmail', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => updateField('customerPhone', e.target.value)}
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>
              </div>
              
              {/* Shipment Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipment Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipientName">Recipient Name *</Label>
                    <Input
                      id="recipientName"
                      required
                      value={formData.recipientName}
                      onChange={(e) => updateField('recipientName', e.target.value)}
                      placeholder="Same as customer or different recipient"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recipientPhone">Recipient Phone *</Label>
                    <Input
                      id="recipientPhone"
                      type="tel"
                      required
                      value={formData.recipientPhone}
                      onChange={(e) => updateField('recipientPhone', e.target.value)}
                      placeholder="+1-555-0123"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Street address, apartment/unit, city, state, ZIP code"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="note">Delivery Note (Optional)</Label>
                    <Textarea
                      id="note"
                      value={formData.note}
                      onChange={(e) => updateField('note', e.target.value)}
                      placeholder="Any special delivery instructions..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
                
                <RadioGroup defaultValue="cod">
                  <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div>
                        <p className="text-gray-900 font-medium">Cash on Delivery (COD)</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-gray-900 font-semibold mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 line-clamp-2">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm text-gray-900 font-medium">{formatVND(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatVND(subtotal)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatVND(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Total</span>
                    <span className="text-blue-600 font-bold text-xl">{formatVND(total)}</span>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Place Order
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}