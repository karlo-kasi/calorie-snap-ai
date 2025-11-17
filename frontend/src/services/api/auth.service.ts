/**
 * Servizio API per autenticazione
 */

import { User, OnboardingData } from "../../types/user.types";
import { API_ENDPOINTS, createAuthHeaders } from "./config";

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

interface UserResponse {
  success: boolean;
  user: User;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  user: User;
  calories?: {
    TARGET: number;
  };
}

/**
 * Login utente
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  console.log("🔐 API: Tentativo di login per:", email);

  const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify({ email, password }),
  });

  console.log("📡 API: Risposta login:", response.status, response.ok);

  if (!response.ok) {
    throw new Error("Login fallito");
  }

  const data = await response.json();
  console.log("✅ API: Dati login ricevuti:", data);

  return data;
};

/**
 * Registrazione utente
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> => {
  console.log("📝 API: Tentativo di registrazione per:", email);

  const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Registrazione fallita");
  }

  const data = await response.json();
  console.log("✅ API: Registrazione completata:", data);

  return data;
};

/**
 * Ottiene i dati dell'utente corrente
 */
export const getCurrentUser = async (token: string): Promise<UserResponse> => {
  console.log("🔄 API: Caricamento dati utente corrente...");

  const response = await fetch(API_ENDPOINTS.PROFILE.ME, {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error("Errore nel caricamento dei dati utente");
  }

  const data = await response.json();
  console.log("✅ API: Dati utente ricevuti:", data);

  return data;
};

/**
 * Completa l'onboarding
 */
export const completeOnboarding = async (
  token: string,
  data: OnboardingData
): Promise<OnboardingResponse> => {
  console.log("📋 API: Completamento onboarding...");

  // Adatta i dati per il backend
  const backendData = {
    nome: data.name,
    cognome: data.surname,
    età: data.age,
    altezza: data.height,
    peso: data.weight,
    sesso:
      data.gender === "female"
        ? "donna"
        : data.gender === "male"
        ? "uomo"
        : "altro",
    attività: data.activityLevel,
    goal: data.goal,
  };

  const response = await fetch(API_ENDPOINTS.PROFILE.ONBOARDING, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(backendData),
  });

  if (!response.ok) {
    throw new Error("Errore durante il completamento dell'onboarding");
  }

  const result = await response.json();
  console.log("✅ API: Onboarding completato:", result);

  return result;
};
