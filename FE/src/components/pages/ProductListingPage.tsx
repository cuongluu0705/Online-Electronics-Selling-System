import { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface ProductListingPageProps {
  products: Product[];
  onNavigate: (page: string, data?: any) => void;
  onAddToCart: (product: Product) => void;
  initialCategory?: string;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function ProductListingPage({ 
  products, 
  onNavigate, 
  onAddToCart,
  initialCategory 
}: ProductListingPageProps) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || ''; 

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  
  const MAX_PRICE = 100000000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const brands = useMemo(() => {
    const uniqueBrands = new Set(products.map(p => p.brand));
    return Array.from(uniqueBrands);
  }, [products]);

  const categories = useMemo(() => {
    const uniqueCats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(uniqueCats)];
  }, [products]);

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];

    const searchMatch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.model && product.model.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && brandMatch && priceMatch && searchMatch;
  });

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {}
        <div className="md:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full flex justify-between"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <span>Filter & Sort</span>
            <Filter className="size-4" />
          </Button>
        </div>

        {}
        <div className={`w-full md:w-64 space-y-8 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          
          {}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                  />
                  <span className={`text-sm ${selectedCategory === category ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max={MAX_PRICE}
                step="500000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatVND(priceRange[0])}</span>
                <span className="font-medium text-blue-600">{formatVND(priceRange[1])}</span>
              </div>
            </div>
          </div>

          {}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Brands</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span className="text-sm text-gray-600">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => {
              setPriceRange([0, MAX_PRICE]);
              setSelectedBrands([]);
              setSelectedCategory('All');
            }}
          >
            Clear Filters
          </Button>
        </div>

        {}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {searchQuery ? `Search results for "${searchQuery}"` : (selectedCategory === 'All' ? 'All Products' : selectedCategory)}
            </h2>
            <span className="text-sm text-gray-500">
              Found {filteredProducts.length} products
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={() => onNavigate('product-details', { productId: product.id })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 text-lg">No products found matching "{searchQuery}".</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setPriceRange([0, MAX_PRICE]);
                  setSelectedCategory('All');
                }}
                className="mt-2"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}