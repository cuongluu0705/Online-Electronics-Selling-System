import { Order } from '../../types';

interface EmailTemplateProps {
  order: Order;
}

export function EmailTemplate({ order }: EmailTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
          <span className="text-white text-2xl">⚡</span>
        </div>
        <h1 className="text-gray-900 mb-2">Order Confirmation</h1>
        <p className="text-gray-600">Thank you for your order!</p>
      </div>
      
      {/* Order Details */}
      <div className="mb-8">
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Order Number:</span>
            <span className="text-blue-600">{order.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="text-gray-900">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* Recipient Info */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-3">Delivery Information</h2>
          <div className="text-gray-600 space-y-1">
            <p><strong className="text-gray-900">Recipient:</strong> {order.recipientName}</p>
            <p><strong className="text-gray-900">Phone:</strong> {order.recipientPhone}</p>
            <p><strong className="text-gray-900">Address:</strong> {order.address}</p>
            <p><strong className="text-gray-900">Estimated Delivery:</strong>{' '}
              {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-3">Order Items</h2>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-gray-600">Product</th>
                <th className="px-4 py-3 text-center text-sm text-gray-600">Qty</th>
                <th className="px-4 py-3 text-right text-sm text-gray-600">Price</th>
                <th className="px-4 py-3 text-right text-sm text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-4 py-3 text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-600">${item.price}</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-center justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <span>Discount:</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-gray-600">
            <span>Shipping:</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-900">Total:</span>
            <span className="text-blue-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Payment Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <p className="text-gray-700">
          <strong>Payment Method:</strong> Cash on Delivery (COD)
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Please prepare the exact amount for delivery
        </p>
      </div>
      
      {/* Footer */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-gray-600 mb-2">
          Questions? Contact us at support@electrostore.com
        </p>
        <p className="text-sm text-gray-500">
          © 2024 ElectroStore. All rights reserved.
        </p>
      </div>
    </div>
  );
}
