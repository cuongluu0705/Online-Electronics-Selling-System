import { CartItem } from '../../types';
import { Button } from '../ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (page: string) => void;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function CartPage({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }: CartPageProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const discountThreshold = 10000000; 
  const discountValue = 500000;
  
  const discount = subtotal > discountThreshold ? discountValue : 0;
  const total = subtotal - discount;
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="size-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Button onClick={() => onNavigate('products')} className="bg-blue-600 hover:bg-blue-700">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {cartItems.map((item) => (
                <div key={item.product.id} className="p-6 border-b border-gray-100 last:border-b-0">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-gray-900 font-medium mb-1">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.brand} - {item.product.model}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-x border-gray-200 text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                            className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                          >
                            +
                          </button>
                        </div>
                        
                        <span className="text-blue-600 font-semibold text-lg">
                          {formatVND(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-gray-900 font-semibold mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
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
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-blue-600 font-bold text-xl">{formatVND(total)}</span>
                </div>
              </div>
              
              <Button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <Button
                onClick={() => onNavigate('products')}
                variant="outline"
                className="w-full mt-3"
              >
                Continue Shopping
              </Button>
              
              {subtotal > 0 && subtotal < discountThreshold && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  Add {formatVND(discountThreshold - subtotal)} more to get {formatVND(discountValue)} discount!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}