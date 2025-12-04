import { Product } from '../types';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 group cursor-pointer">
      <div 
        className="relative aspect-square bg-gray-50 overflow-hidden"
        onClick={() => onViewDetails?.(product)}
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercent > 0 && (
          <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
            -{discountPercent}%
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute top-3 left-3 bg-gray-500">
            Out of Stock
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <p className="text-xs text-gray-500">{product.brand}</p>
          <h3 
            className="text-gray-900 font-medium line-clamp-2 hover:text-blue-600 transition-colors"
            onClick={() => onViewDetails?.(product)}
          >
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-700">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex items-end gap-2 mb-4">
          <span className="text-blue-600 font-semibold text-lg">{formatVND(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatVND(product.originalPrice)}</span>
          )}
        </div>
        
        <Button 
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <ShoppingCart className="size-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}