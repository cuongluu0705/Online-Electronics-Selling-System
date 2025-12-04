import { apiGet, apiRequest } from './client';

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available_quantity: number;
  status: string; 
}

//Get product list for staff
export async function getStaffProducts(): Promise<Product[]> {
  const token = localStorage.getItem('token') ?? '';
  return apiGet<Product[]>('/staff/products', token);
}

//Create new product
export async function createProduct(
  product: Omit<Product, 'id'>
): Promise<Product> {
  const token = localStorage.getItem('token') ?? '';
  return apiRequest<Product>('POST', '/staff/products', product, token);
}

//Update existing product
export async function updateProduct(
  id: string | number,
  product: Partial<Product>
): Promise<Product> {
  const token = localStorage.getItem('token') ?? '';
  return apiRequest<Product>('PUT', `/staff/products/${id}`, product, token);
}

//Update product status
export async function updateProductStatus(
  id: string | number,
  status: string
): Promise<Product> {
  const token = localStorage.getItem('token') ?? '';
  return apiRequest<Product>(
    'PUT',
    `/staff/products/${id}/update_product_status`,
    { status },
    token
  );
}
