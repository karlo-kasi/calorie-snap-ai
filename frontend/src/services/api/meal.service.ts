/**
 * Servizio API per pasti
 */

import {
  Meal,
  CreateMealRequest,
  MealResponse,
  MealsListResponse,
} from "../../types/meal.types";
import { API_ENDPOINTS, createAuthHeaders } from "./config";

/**
 * Crea un nuovo pasto analizzando un'immagine
 */
export const createMeal = async (
  token: string,
  data: CreateMealRequest
): Promise<MealResponse> => {
  console.log("📸 API: Creazione pasto con analisi immagine...");

  const response = await fetch(API_ENDPOINTS.MEALS.CREATE, {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Errore durante la creazione del pasto");
  }

  const result = await response.json();
  console.log("✅ API: Pasto creato:", result);

  return result;
};

/**
 * Ottiene i pasti di oggi con statistiche
 */
export const getTodayMeals = async (
  token: string
): Promise<MealsListResponse> => {
  console.log("🍽️ API: Caricamento pasti di oggi...");

  const response = await fetch(API_ENDPOINTS.MEALS.TODAY, {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Errore durante il caricamento dei pasti");
  }

  const result = await response.json();
  console.log("✅ API: Pasti di oggi ricevuti:", result);

  return result;
};

/**
 * Ottiene un pasto specifico per ID
 */
export const getMealById = async (
  token: string,
  mealId: string
): Promise<MealResponse> => {
  console.log("🔍 API: Caricamento pasto:", mealId);

  const response = await fetch(API_ENDPOINTS.MEALS.BY_ID(mealId), {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Pasto non trovato");
    }
    if (response.status === 403) {
      throw new Error("Non hai i permessi per visualizzare questo pasto");
    }
    throw new Error("Errore durante il caricamento del pasto");
  }

  const result = await response.json();
  console.log("✅ API: Pasto ricevuto:", result);

  return result;
};

/**
 * Elimina un pasto per ID
 */
export const deleteMeal = async (
  token: string,
  mealId: string
): Promise<{ success: boolean; message: string }> => {
  console.log("🗑️ API: Eliminazione pasto:", mealId);

  const response = await fetch(API_ENDPOINTS.MEALS.DELETE(mealId), {
    method: "DELETE",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Pasto non trovato");
    }
    if (response.status === 403) {
      throw new Error("Non hai i permessi per eliminare questo pasto");
    }
    throw new Error("Errore durante l'eliminazione del pasto");
  }

  const result = await response.json();
  console.log("✅ API: Pasto eliminato");

  return result;
};
