const fallbackApiBaseUrl = 'https://crop-detection-ai.onrender.com';

function resolveApiBaseUrl() {
  const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '';
    }
  }

  return fallbackApiBaseUrl;
}

const rawApiBaseUrl = resolveApiBaseUrl();

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!rawApiBaseUrl) {
    return normalizedPath;
  }

  return `${rawApiBaseUrl}${normalizedPath}`;
}