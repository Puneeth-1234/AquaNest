/**
 * AquaNest Frontend Environment & API Configuration
 *
 * Configurable architecture supporting seamless switching between
 * local development (http://localhost:5000/api) and production deployments.
 */
(function (window) {
  'use strict';

  // Detect local development environment
  const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]' ||
    window.location.protocol === 'file:' ||
    !window.location.hostname
  );

  // In production, resolves to:
  // 1. Explicit window.AQUANEST_API_URL if injected at runtime/build-time
  // 2. Relative '/api' if hosted on the same origin / reverse proxy
  // 3. Fallback production API endpoint
  const resolveProdApiUrl = () => {
    if (window.AQUANEST_API_URL) return window.AQUANEST_API_URL;
    if (window.location.origin && window.location.protocol.startsWith('http')) {
      return `${window.location.origin}/api`;
    }
    return 'https://api.aquanest.in/api';
  };

  const DEV_API_URL = 'http://localhost:5000/api';
  const PROD_API_URL = resolveProdApiUrl();

  window.AQUANEST_CONFIG = {
    // Current environment ('development' | 'production')
    ENV: isLocalhost ? 'development' : 'production',

    // Configurable API base URL (No trailing slash)
    API_BASE_URL: isLocalhost ? DEV_API_URL : PROD_API_URL,

    // Allows dynamic override at runtime
    setApiBaseUrl: function (url) {
      if (url && typeof url === 'string') {
        const cleanUrl = url.replace(/\/+$/, '');
        this.API_BASE_URL = cleanUrl;
        if (window.AquaNestAPI) {
          window.AquaNestAPI.baseUrl = cleanUrl;
        }
        console.log(`[AquaNest Config] API Base URL set to: ${cleanUrl}`);
      }
    }
  };
})(typeof window !== 'undefined' ? window : this);
