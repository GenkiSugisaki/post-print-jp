/**
 * fetch with a hard timeout. Aborts the request after `timeoutMs` and throws
 * a DOMException with `name === 'AbortError'` so callers can distinguish
 * timeout from generic network errors when rendering error messages.
 */
export async function fetchWithTimeout(
  url: string,
  timeoutMs: number = 5000,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
