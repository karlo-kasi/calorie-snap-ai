/**
 * Servizio API per autenticazione
 */

import { User } from "../../types/user.types";
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
