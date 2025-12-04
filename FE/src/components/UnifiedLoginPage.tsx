import React, { useState } from 'react';
import { Button } from './ui/button';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export interface UnifiedLoginPageProps {
  onLogin: (email: string, pass: string, role: 'buyer' | 'staff' | 'admin') => Promise<void>;
}

export const UnifiedLoginPage: React.FC<UnifiedLoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password, 'buyer');
      // Toast success sẽ được gọi ở App.tsx sau khi login thành công
    } catch (err: any) {
      // Dùng Toast báo lỗi thay vì hiện text đỏ
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 relative">
      {/* Nút Back to Home */}
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft className="size-5" />
        Back to Home
      </Link>

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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
              placeholder="e.g., an.nguyen@gmail.com" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
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
          
          <div className="flex flex-col gap-2 text-center mt-4 text-sm">
            <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
            {/* Link Đăng ký mới */}
            <div className="text-gray-500">
              Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Create New Account</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};