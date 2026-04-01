const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function getToken(): string | null {
  return localStorage.getItem('smartx_token');
}

export function setToken(token: string) {
  localStorage.setItem('smartx_token', token);
}

export function clearToken() {
  localStorage.removeItem('smartx_token');
  localStorage.removeItem('smartx_user');
}

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(extra as Record<string, string> | undefined),
  });
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: buildHeaders(init?.headers as HeadersInit | undefined),
  });

  let body: unknown;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    body = await res.json();
  } else {
    const text = await res.text();
    body = { error: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    const b = body as { error?: string; detail?: string } | undefined;
    const message = b?.detail ? `${b.error}: ${b.detail}` : (b?.error || `HTTP ${res.status}`);
    throw new ApiError(message, res.status);
  }

  return body as T;
}

export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'GET' });
  },

  post<T>(path: string, data?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(path: string, data?: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: 'DELETE' });
  },

  async upload(path: string, file: File): Promise<{ path: string }> {
    const url = `${API_BASE}${path}`;
    const formData = new FormData();
    formData.append('file', file);

    const headers = new Headers({ Accept: 'application/json' });
    const token = getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(url, { method: 'POST', headers, body: formData });
    const body = await res.json();
    if (!res.ok) throw new ApiError(body?.error || `HTTP ${res.status}`, res.status);
    return body as { path: string };
  },
};

/**
 * Resolve a stored file path to a full URL for display.
 * Paths starting with "uploads/" are served by our own server.
 * Absolute URLs (http/https) are returned as-is.
 */
export function resolveMediaUrl(filePath: string | null | undefined): string | null {
  if (!filePath) return null;
  if (/^https?:\/\//i.test(filePath)) return filePath;
  return `${API_BASE}/${filePath.replace(/^\//, '')}`;
}
