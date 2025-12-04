import React, { useState } from 'react';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react'; 
export interface UnifiedLoginPageProps {
  onLogin: (email: string, pass: string, role: 'buyer' | 'staff' | 'admin') => void;
}

export const UnifiedLoginPage: React.FC<UnifiedLoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State quản lý việc hiện/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(email, password, 'buyer');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Customer Login</h1>
        <p className="text-center text-gray-500 mb-8">Welcome back to ElectroStore</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email or Username</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
              placeholder="e.g., john.doe@example.com" 
            />
          </div>
          
          {/* PASSWORD FIELD WITH TOGGLE */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} // Đổi type dựa theo state
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" // pr-10 để chừa chỗ cho icon
                required 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
          </div>
        </div>
      </form>
    </div>
  );
};