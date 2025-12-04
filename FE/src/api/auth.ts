const API_BASE = 'http://localhost:8000'; 

export interface LoginResponse {
  access_token: string;
  role: 'buyer' | 'staff' | 'admin';
  userId: number;
  username: string;
  name?: string;
}

export async function login(email: string, password: string, role: 'buyer' | 'staff' | 'admin'): Promise<LoginResponse> {
  const payload = { username: email, password: password, role: role };
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }
    return data as LoginResponse;
  } catch (error: any) {
    throw new Error(error.message || "Server connection error");
  }
}

export async function register(name: string, email: string, phone: string, pass: string) {
  const payload = { name, email, phone, password: pass };
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Registration failed");
    }
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Server connection error");
  }
}