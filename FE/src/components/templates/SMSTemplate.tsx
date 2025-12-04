import { Order } from '../../types';
import { MessageSquare } from 'lucide-react';

interface SMSTemplateProps {
  order: Order;
}

export function SMSTemplate({ order }: SMSTemplateProps) {
  const smsMessage = `
ElectroStore Order Confirmation

Order #${order.id}

Dear ${order.recipientName},

Your order has been confirmed!

Items: ${order.items.map(item => `${item.productName} (${item.quantity}x)`).join(', ')}

Total: $${order.total}

Delivery to: ${order.address}

Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}

Payment: Cash on Delivery

Track your order: electrostore.com/track/${order.id}

Questions? Call us at 1-555-ELECTRO

Thank you for shopping with ElectroStore!
  `.trim();
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Phone Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center gap-3">
          <MessageSquare className="size-6 text-white" />
          <div>
            <h3 className="text-white">SMS Preview</h3>
            <p className="text-xs text-blue-100">To: {order.recipientPhone}</p>
          </div>
        </div>
        
        {/* Message Body */}
        <div className="p-6 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-sm p-4 max-w-[280px] ml-auto">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
              {smsMessage}
            </pre>
            <div className="text-xs text-gray-500 mt-2 text-right">
              {new Date(order.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
        
        {/* Character Count */}
        <div className="px-6 py-3 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            {smsMessage.length} characters • ~{Math.ceil(smsMessage.length / 160)} SMS
          </p>
        </div>
      </div>
    </div>
  );
}
