import { ReactNode } from 'react';
import { Users, Settings, LogOut, Shield, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminLayout({ children, currentPage, onNavigate, onLogout }: AdminLayoutProps) {
  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'admin-users', label: 'User Management', icon: Users },
    { id: 'admin-settings', label: 'System Settings', icon: Settings }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 text-white flex flex-col">
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="size-8" />
            <div>
              <h2 className="text-white">Admin Portal</h2>
              <p className="text-xs text-blue-100">ElectroStore</p>
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
                        ? 'bg-white text-blue-600'
                        : 'text-blue-50 hover:bg-blue-500'
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
        
        <div className="p-4 border-t border-blue-500">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-blue-50 hover:text-white hover:bg-blue-500"
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
