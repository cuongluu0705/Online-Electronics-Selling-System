const API_BASE = 'http://localhost:8000'; 

export interface LoginResponse {
  access_token: string;
  role: 'buyer' | 'staff' | 'admin';
  userId: number;
  username: string;
  name?: string;
}

export async function login(email: string, password: string, role: 'buyer' | 'staff' | 'admin'): Promise<LoginResponse> {

  const backendRole = role === 'buyer' ? 'customer' : role;

  console.log("Sending Login Request:", { username: email, role: backendRole }); 

  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,   
      password: password,
      role: backendRole, 
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Login Error Detail:", data);
    throw new Error(data.detail || Array.isArray(data.detail) ? JSON.stringify(data.detail) : 'Login failed');
  }

  const responseRole = data.role === 'customer' ? 'buyer' : data.role;

  return {
    ...data,
    role: responseRole,
  } as LoginResponse;
}