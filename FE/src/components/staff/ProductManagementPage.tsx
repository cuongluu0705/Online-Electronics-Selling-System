import { useState } from 'react';
import { Product } from '../../types';
import { Button } from '../ui/button';
import { Plus, Edit, Power, Search, X, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductManagementPageProps {
  products: Product[]; 
  onAddProduct: (data: any) => Promise<void>;
  onUpdateProduct: (id: string, data: any) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
}

const formatVND = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function ProductManagementPage({ 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onToggleStatus 
}: ProductManagementPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    brand: '',
    category: 'Smartphones',
    price: '',
    stock: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      id: '', name: '', brand: '', category: 'Smartphones', price: '', stock: '', description: ''
    });
  };

  const handleOpenAdd = () => {
    setModalMode('add');
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setModalMode('edit');
    setFormData({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      alert("Name and Price are required!");
      return;
    }

    setIsLoading(true);
    try {
      if (modalMode === 'add') {
        if (!formData.id) {
          alert("Product ID is required for new products!");
          setIsLoading(false);
          return;
        }
        await onAddProduct({
          id: formData.id,
          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          description: formData.description
        });
      } else {
        await onUpdateProduct(formData.id, {
          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
          description: formData.description
        });
      }
      setIsModalOpen(false); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    if(!window.confirm("Are you sure you want to change this product's status?")) return;
    
    setIsLoading(true);
    try {
      await onToggleStatus(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 relative">
      {}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <Loader2 className="size-8 animate-spin text-blue-600" />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500">View and manage store product catalog</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4 mr-2" />
          Add Product
        </Button>
      </div>

      {}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Search by name or product ID..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-700">Product</th>
                <th className="p-4 font-semibold text-gray-700">Category</th>
                <th className="p-4 font-semibold text-gray-700">Price</th>
                <th className="p-4 font-semibold text-gray-700">Stock</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                          <ImageWithFallback 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.model || product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{product.category}</td>
                    <td className="p-4 font-medium text-gray-900">{formatVND(product.price)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-700' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleOpenEdit(product)}
                          className="text-gray-600 hover:text-blue-600"
                          title="Edit Product"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleStatus(product.id)}
                          className={product.status === 'Active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
                          title={product.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                  <input 
                    required
                    disabled={modalMode === 'edit'}
                    type="text" 
                    className={`w-full px-3 py-2 border rounded-lg outline-none ${modalMode === 'edit' ? 'bg-gray-100 text-gray-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                    placeholder="e.g. PH_NEW_01"
                    value={formData.id}
                    onChange={e => setFormData({...formData, id: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Samsung"
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Samsung Galaxy S24"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (VND) *</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="20000000"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="100"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="TVs">TVs</option>
                  <option value="Watches">Watches</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : (modalMode === 'add' ? 'Add' : 'Save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}