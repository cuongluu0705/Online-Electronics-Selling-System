import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { register } from '../../api/auth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.phone, formData.password);
      toast.success("Account created successfully! Please login.");
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium">
        <ArrowLeft className="size-5" />
        Back to Home
      </Link>

      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">Create Account</h1>
        <p className="text-center text-gray-500 mb-8">Join ElectroStore today</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required placeholder="+1 234 567 890" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" required placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          
          <div className="text-center mt-4 text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
          </div>
        </div>
      </form>
    </div>
  );
};