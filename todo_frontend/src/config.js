/**
 * Configuration helper for environment-based settings.
 */

/**
 * PUBLIC_INTERFACE
 * Resolve the backend API base URL from environment variables.
 *
 * Prefers REACT_APP_API_BASE, falls back to REACT_APP_BACKEND_URL.
 * Never hardcodes localhost to keep deployments flexible.
 */
export function getApiBaseUrl() {
  const base = (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "").trim();

  // Allow empty base to support running UI even when backend isn't available.
  // API client will handle this gracefully and surface an error.
  return base.replace(/\/+$/, "");
}
