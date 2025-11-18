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
import { fileToBase64 } from "../fileToBase64";

/**
 * Risposta dell'analisi AI di un'immagine
 */
export interface AnalysisResponse {
  success: boolean;
  message: string;
  data: {
    dishName: string;
    ingredients: string[];
    calories: number;
    macronutrients: {
      proteins: number;
      carbohydrates: number;
      fats: number;
    };
    portionSize: string;
    confidence: string;
    notes: string;
    imageBase64: string;
    _id: string;
    createdAt: string;
  };
}

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
 * Ottiene i pasti per una data specifica (formato: YYYY-MM-DD)
 */
export const getMealsByDate = async (
  token: string,
  date: string
): Promise<MealsListResponse> => {
  console.log("📅 API: Caricamento pasti per data:", date);

  const response = await fetch(API_ENDPOINTS.MEALS.BY_DATE(date), {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Errore durante il caricamento dei pasti");
  }

  const result = await response.json();
  console.log("✅ API: Pasti ricevuti per", date, ":", result);

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

/**
 * Analizza un'immagine di cibo usando l'AI
 * @deprecated Usa createMeal invece per creare un pasto completo
 */
export const analyzeImageFile = async (file: File): Promise<AnalysisResponse> => {
  console.log("📸 API: Analisi immagine con AI...");

  // Converti in base64
  const base64Image = await fileToBase64(file);

  // Determina il tipo MIME
  const mediaType = file.type || "image/jpeg";

  console.log("📤 Invio foto al backend...");
  console.log("   - Tipo:", mediaType);
  console.log("   - Dimensione base64:", base64Image.length);

  // Nota: Questo endpoint potrebbe essere deprecato
  // Verifica quale endpoint usa il backend per l'analisi
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/analysis";

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64: base64Image,
      mediaType: mediaType,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Errore durante l'analisi");
  }

  console.log("✅ Analisi completata:", data);

  return data;
};
