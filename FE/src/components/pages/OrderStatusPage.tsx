import { Order } from '../../types';
import { Button } from '../ui/button';
import { CheckCircle, Circle, Package, Truck, Home } from 'lucide-react';

interface OrderStatusPageProps {
  order: Order;
  onNavigate: (page: string) => void;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function OrderStatusPage({ order, onNavigate }: OrderStatusPageProps) {
  const statusSteps = [
    { key: 'Placed', label: 'Order Placed', icon: Circle },
    { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'Shipping', label: 'Shipping', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: Home }
  ];
  
  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-600 mb-12">Order ID: <span className="text-blue-600">{order.id}</span></p>
        
        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>
            
            {/* Status Steps */}
            <div className="relative grid grid-cols-4 gap-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                        isCompleted
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <span
                      className={`text-sm text-center ${
                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-900 mb-4">Delivery Information</h3>
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
              <div className="pt-3 border-t border-gray-100">
                <span className="text-gray-500">Estimated Delivery:</span>
                <p className="text-gray-900 mt-1">
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between">
                  <div className="text-gray-900">
                    {item.productName}
                    <span className="text-gray-500 ml-2">× {item.quantity}</span>
                  </div>
                  <span className="text-gray-900">{formatVND(item.price * item.quantity)}</span>
                </div>
              ))}
              
              <div className="border-t border-gray-100 pt-3 space-y-2">
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">{formatVND(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Message */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Package className="size-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-gray-900 mb-2">
                {order.status === 'Placed' && 'Your order has been placed'}
                {order.status === 'Confirmed' && 'Your order has been confirmed'}
                {order.status === 'Shipping' && 'Your order is on the way'}
                {order.status === 'Delivered' && 'Your order has been delivered'}
              </h3>
              <p className="text-gray-600">
                {order.status === 'Placed' && 'We are processing your order and will confirm it soon.'}
                {order.status === 'Confirmed' && 'Your order is being prepared for shipment.'}
                {order.status === 'Shipping' && 'Your package is on its way to the delivery address.'}
                {order.status === 'Delivered' && 'Your package has been successfully delivered. Thank you for shopping with us!'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => onNavigate('home')} variant="outline">
            Continue Shopping
          </Button>
          <Button onClick={() => onNavigate('products')} className="bg-blue-600 hover:bg-blue-700">
            Shop More
          </Button>
        </div>
      </div>
    </div>
  );
}