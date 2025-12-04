export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';


export async function apiGet<T>(
  path: string,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function apiRequest<T>(
  method: 'POST' | 'PUT' | 'DELETE',
  path: string,
  body: unknown,
  token?: string
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
