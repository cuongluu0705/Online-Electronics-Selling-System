import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { Button } from '../ui/button';
import { ArrowRight, Layers } from 'lucide-react';
import { useMemo } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface HomePageProps {
  products: Product[];
  onNavigate: (page: string, data?: any) => void;
  onAddToCart: (product: Product) => void;
}

export function HomePage({ products, onNavigate, onAddToCart }: HomePageProps) {
  const featuredProducts = products.slice(0, 8);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = (p as any).category ?? 'Other';
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    const dynamicCats = Array.from(map.entries()).map(([name, count]) => ({ name, count }));

    return [
      { name: 'All Products', count: products.length, isAll: true },
      ...dynamicCats
    ];
  }, [products]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative h-[500px] bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1582018960590-f3bc3ea25c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMHN0b3JlJTIwYmFubmVyfGVufDF8fHx8MTc2Mzc4NTc5Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Electronics Store"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Latest Tech, Unbeatable Prices</h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover cutting-edge electronics with exclusive deals and fast shipping
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => onNavigate('products')}
            >
              Shop Now
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => onNavigate('products', { category: category.isAll ? 'All' : category.name })}
              className={`rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 ${
                category.isAll ? 'bg-blue-50 border-blue-200' : 'bg-white'
              }`}
            >
              {category.isAll && <Layers className="size-8 text-blue-600 mx-auto mb-3" />}
              <h3 className={`font-medium mb-1 ${category.isAll ? 'text-blue-700' : 'text-gray-900'}`}>
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count} products</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Featured Products</h2>
          <Button 
            variant="outline"
            onClick={() => onNavigate('products')}
          >
            View All
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={(product) => onNavigate('product-details', { productId: product.id })}
            />
          ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold text-white mb-4">Black Friday Deals Coming Soon!</h2>
          <p className="text-xl text-purple-100 mb-8">
            Save up to 50% on selected electronics
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            Get Notified
          </Button>
        </div>
      </section>
    </div>
  );
}