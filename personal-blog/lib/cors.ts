/**
 * CORS origin helper. Uses NEXT_PUBLIC_SITE_URL and allows localhost for dev.
 */
const DEFAULT_ORIGIN = "http://localhost:5173";

function getAllowedOrigins(): string[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const origins = [DEFAULT_ORIGIN];
  if (siteUrl && siteUrl !== DEFAULT_ORIGIN) {
    origins.push(siteUrl);
  }
  return origins;
}

export function getCorsOrigin(request: Request): string {
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get("origin");
  const fallback = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_ORIGIN;
  return allowedOrigins.includes(origin ?? "") ? origin ?? fallback : fallback;
}

export function getCorsHeaders(request: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(request),
  };
}
