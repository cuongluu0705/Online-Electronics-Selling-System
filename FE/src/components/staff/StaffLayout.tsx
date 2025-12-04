import { ReactNode } from 'react';
import { Package, ShoppingBag, LogOut, BarChart3, Edit3 } from 'lucide-react';
import { Button } from '../ui/button';

interface StaffLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function StaffLayout({ children, currentPage, onNavigate, onLogout }: StaffLayoutProps) {
  const menuItems = [
    { id: 'staff-dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'staff-products', label: 'Product Management', icon: Package },
    { id: 'staff-product-modification', label: 'Product Modification', icon: Edit3 },
    { id: 'staff-orders', label: 'Order Management', icon: ShoppingBag }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">⚡</span>
            </div>
            <div>
              <h2 className="text-gray-900">Staff Portal</h2>
              <p className="text-xs text-gray-500">ElectroStore</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="size-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="size-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
