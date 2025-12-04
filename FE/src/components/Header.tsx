import { Search, ShoppingCart, User, Menu, LogOut, Package, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  cartItemCount?: number;
  onNavigate?: (page: string) => void;
  currentPage?: string;
  user?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
}

export function Header({ cartItemCount = 0, user, onLogout }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate('/products'); 
      }
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-gray-900 font-bold text-lg hidden sm:block">ElectroStore</span>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products (press Enter)..."
                className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Cart Button */}
            <Link to="/cart">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <ShoppingCart className="size-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-blue-600 hover:bg-blue-700 text-[10px] border-2 border-white">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Profile / Login Section */}
            {user ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User className="size-5" />
                </Button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-1">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="size-4 text-gray-500" />
                          Account Settings
                        </Link>
                        <Link 
                          to="/orders" 
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Package className="size-4 text-gray-500" />
                          My Orders
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 p-1">
                        <button 
                          onClick={() => {
                            onLogout?.();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="size-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:flex text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Sign In
                </Button>
                <Button variant="ghost" size="icon" className="sm:hidden text-gray-700">
                  <User className="size-5" />
                </Button>
              </Link>
            )}

            {}
            <Button variant="ghost" size="icon" className="md:hidden text-gray-700">
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-9 pr-4 w-full bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      </div>
    </header>
  );
}