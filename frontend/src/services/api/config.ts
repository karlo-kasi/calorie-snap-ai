/**
 * Configurazione API
 */

export const API_BASE_URL = "http://localhost:3000/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  PROFILE: {
    ME: `${API_BASE_URL}/profile/me`,
    ONBOARDING: `${API_BASE_URL}/profile/onboarding`,
    STATS: `${API_BASE_URL}/profile/stats`,
    STATS_WEEKLY: `${API_BASE_URL}/profile/stats-weekly`,
    STATS_MONTHLY: `${API_BASE_URL}/profile/stats-monthly`,
  },
  MEALS: {
    CREATE: `${API_BASE_URL}/meals/meal/upload`,
    TODAY: `${API_BASE_URL}/meals/analysis/stats`,
    BY_DATE: (date: string) => `${API_BASE_URL}/meals/analysis/date/${date}`,
    BY_ID: (id: string) => `${API_BASE_URL}/meals/analysis/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/meals/analysis/${id}`,
  },
};

/**
 * Helper per creare headers con autenticazione
 */
export const createAuthHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
