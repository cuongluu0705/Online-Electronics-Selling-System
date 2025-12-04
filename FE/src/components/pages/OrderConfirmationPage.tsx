import { Order } from '../../types';
import { Button } from '../ui/button';
import { CheckCircle, Mail, MessageSquare, Package } from 'lucide-react';

interface OrderConfirmationPageProps {
  order: Order;
  onNavigate: (page: string) => void;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function OrderConfirmationPage({ order, onNavigate }: OrderConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="size-12 text-green-600" />
          </div>
          <h1 className="text-gray-900 mb-3">Order Placed Successfully!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Thank you for your order. Your order ID is{' '}
            <span className="text-blue-600">{order.id}</span>
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-blue-600" />
              <span>Confirmation email sent</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-blue-600" />
              <span>SMS notification sent</span>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-gray-900">Order Details</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-gray-900 mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Recipient:</span>
                    <span className="text-gray-900 ml-2">{order.recipientName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <span className="text-gray-900 ml-2">{order.recipientPhone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <p className="text-gray-900 mt-1">{order.address}</p>
                  </div>
                  {order.note && (
                    <div>
                      <span className="text-gray-500">Note:</span>
                      <p className="text-gray-900 mt-1">{order.note}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-900 mb-3">Estimated Delivery</h3>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Package className="size-8 text-blue-600" />
                  <div>
                    <p className="text-gray-900">
                      {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-gray-900 mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-900">
                        {item.productName}
                      </div>
                      <span className="text-sm text-gray-500">× {item.quantity}</span>
                    </div>
                    <span className="text-gray-900">{formatVND(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 mt-6 pt-6 space-y-2">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatVND(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatVND(order.discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">{formatVND(order.total)}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="text-gray-900">Payment Method:</span> Cash on Delivery (COD)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('order-status')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Track Order
          </Button>
          <Button
            onClick={() => onNavigate('home')}
            variant="outline"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}