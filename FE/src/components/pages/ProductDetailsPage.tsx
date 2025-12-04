import { useState } from 'react';
import { Product } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, ShoppingCart, Shield, Truck, CheckCircle } from 'lucide-react';
import { ProductCard } from '../ProductCard';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductDetailsPageProps {
  product: Product;
  relatedProducts: Product[];
  onAddToCart: (product: Product) => void;
  onNavigate: (page: string, data?: any) => void;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function ProductDetailsPage({ product, relatedProducts, onAddToCart, onNavigate }: ProductDetailsPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image];

  const currentImage = images[selectedImageIndex] || images[0] || product.image;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span onClick={() => onNavigate('home')} className="cursor-pointer hover:text-blue-600">Home</span>
          <span>/</span>
          <span onClick={() => onNavigate('products')} className="cursor-pointer hover:text-blue-600">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden mb-4 aspect-square border border-gray-100 relative">
              <ImageWithFallback
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`bg-white rounded-lg overflow-hidden cursor-pointer border-2 transition-colors aspect-square ${
                      selectedImageIndex === idx ? 'border-blue-600' : 'border-gray-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-600">Model: {product.model || product.id}</p>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`size-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-900 font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>
            
            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold text-blue-600">{formatVND(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">{formatVND(product.originalPrice)}</span>
                    <Badge className="bg-red-500 hover:bg-red-600">Save {discountPercent}%</Badge>
                  </>
                )}
              </div>
              
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600 font-medium mt-2">
                  <CheckCircle className="size-5" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="text-red-600 font-medium mt-2">Out of Stock</div>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
              
              <Button
                onClick={() => onAddToCart({ ...product, quantity })} // Pass quantity if supported, else default 1
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 text-lg shadow-lg shadow-blue-600/20"
              >
                <ShoppingCart className="size-5 mr-2" />
                Add to Cart
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                <Shield className="size-6 text-blue-600" />
                <div>
                  <p className="text-gray-900 font-medium">{product.warranty}</p>
                  <p className="text-xs text-gray-500">Official Warranty</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                <Truck className="size-6 text-blue-600" />
                <div>
                  <p className="text-gray-900 font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-500">Orders over {formatVND(2500000)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        <div className="bg-white rounded-xl p-8 mb-16 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-500 font-medium">{key}</span>
                <span className="text-gray-900 text-right font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onViewDetails={(product) => onNavigate('product-details', { productId: product.id })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}