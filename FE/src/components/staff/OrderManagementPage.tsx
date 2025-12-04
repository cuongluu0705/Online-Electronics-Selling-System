import { useState } from 'react';
import { Order } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Search, Eye } from 'lucide-react';

interface OrderManagementPageProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export function OrderManagementPage({ orders, onUpdateOrderStatus }: OrderManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Placed': return 'bg-blue-500';
      case 'Confirmed': return 'bg-purple-500';
      case 'Shipping': return 'bg-orange-500';
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage customer orders</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-gray-900">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-gray-900">{order.recipientName}</div>
                      <div className="text-sm text-gray-500">{order.recipientPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{order.items.length} items</TableCell>
                  <TableCell className="text-gray-900">${order.total}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="size-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>
      
      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Status Update */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-gray-900 mb-3">Update Order Status</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(['Placed', 'Confirmed', 'Shipping', 'Delivered', 'Cancelled'] as const).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedOrder.status === status ? 'default' : 'outline'}
                        onClick={() => onUpdateOrderStatus(selectedOrder.id, status)}
                        className={selectedOrder.status === status ? getStatusColor(status) : ''}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Customer & Delivery Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-gray-900 mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <span className="text-gray-900 ml-2">{selectedOrder.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900 ml-2">{selectedOrder.customerEmail}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-gray-900 ml-2">{selectedOrder.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-900 mb-3">Delivery Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Recipient:</span>
                        <span className="text-gray-900 ml-2">{selectedOrder.recipientName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-gray-900 ml-2">{selectedOrder.recipientPhone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Address:</span>
                        <p className="text-gray-900 mt-1">{selectedOrder.address}</p>
                      </div>
                      {selectedOrder.note && (
                        <div>
                          <span className="text-gray-500">Note:</span>
                          <p className="text-gray-900 mt-1">{selectedOrder.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h3 className="text-gray-900 mb-3">Order Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Product</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Quantity</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Price</th>
                          <th className="px-4 py-3 text-right text-sm text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.productId}>
                            <td className="px-4 py-3 text-gray-900">{item.productName}</td>
                            <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-gray-600">${item.price}</td>
                            <td className="px-4 py-3 text-right text-gray-900">${item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${selectedOrder.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-blue-600">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment & Dates */}
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Payment Method:</span>
                    <span className="text-gray-900 ml-2">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Estimated Delivery:</span>
                    <span className="text-gray-900 ml-2">
                      {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
