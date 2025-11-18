/**
 * Servizio API per il profilo utente
 */

import { User, OnboardingData } from "../../types/user.types";
import { API_ENDPOINTS, createAuthHeaders } from "./config";

interface UserResponse {
  success: boolean;
  user: User;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  user: User;
  calories?: {
    BMR: number;
    TDEE: number;
    TARGET: number;
    deficit: number;
    macros: {
      proteins: number;
      carbos: number;
      fats: number;
    };
  };
}

interface EditUserResponse {
  success: boolean;
  message: string;
  user: User;
  calories?: {
    BMR: number;
    TDEE: number;
    TARGET: number;
    deficit: number;
    macros: {
      proteins: number;
      carbos: number;
      fats: number;
    };
  };
}

interface DashboardStats {
  success: boolean;
  data: {
    user: {
      targetCalories: number;
      currentWeight: number | null;
      goalWeight: number | null;
      activityLevel: string | null;
    };
    today: {
      consumed: {
        calories: number;
        proteins: number;
        carbohydrates: number;
        fats: number;
      };
      remaining: number;
      mealsCount: number;
      meals: any[];
    };
    progress: {
      percentage: number;
      status: "on_track" | "over" | "under";
    };
  };
}

interface WeeklyStats {
  success: boolean;
  data: {
    period: {
      start: string;
      end: string;
      days: number;
    };
    summary: {
      averageCalories: number;
      totalMeals: number;
      daysTracked: number;
      daysInDeficit: number;
      daysInSurplus: number;
      targetCalories: number;
    };
    dailyBreakdown: any[];
  };
}

interface MonthlyStats {
  success: boolean;
  data: {
    period: {
      start: string;
      end: string;
      days: number;
    };
    summary: {
      averageCalories: number;
      totalCalories: number;
      totalMeals: number;
      daysTracked: number;
      daysInDeficit: number;
      daysInSurplus: number;
      targetCalories: number;
      totalMacros: {
        proteins: number;
        carbohydrates: number;
        fats: number;
      };
    };
    dailyBreakdown: any[];
  };
}

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

/**
 * Modifica le informazioni dell'utente
 */
export const editUserInformation = async (
  token: string,
  data: Partial<OnboardingData>
): Promise<EditUserResponse> => {
  console.log("✏️ API: Modifica informazioni utente...");

  // Adatta i dati per il backend (solo i campi forniti)
  const backendData: any = {};

  if (data.name) backendData.nome = data.name;
  if (data.surname) backendData.cognome = data.surname;
  if (data.age) backendData.età = data.age;
  if (data.height) backendData.altezza = data.height;
  if (data.weight) backendData.peso = data.weight;
  if (data.gender) {
    backendData.sesso =
      data.gender === "female"
        ? "donna"
        : data.gender === "male"
        ? "uomo"
        : "altro";
  }
  if (data.activityLevel) backendData.attività = data.activityLevel;
  if (data.goal) backendData.goal = data.goal;

  const response = await fetch(API_ENDPOINTS.PROFILE.EDIT_USER, {
    method: "PUT",
    headers: createAuthHeaders(token),
    body: JSON.stringify(backendData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Errore durante la modifica del profilo");
  }

  const result = await response.json();
  console.log("✅ API: Profilo aggiornato:", result);

  return result;
};

/**
 * Ottiene le statistiche della dashboard
 */
export const getDashboardStats = async (
  token: string
): Promise<DashboardStats> => {
  console.log("📊 API: Caricamento statistiche dashboard...");

  const response = await fetch(API_ENDPOINTS.PROFILE.STATS, {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Errore durante il caricamento delle statistiche");
  }

  const data = await response.json();
  console.log("✅ API: Statistiche dashboard ricevute:", data);

  return data;
};

/**
 * Ottiene le statistiche settimanali
 */
export const getWeeklyStats = async (token: string): Promise<WeeklyStats> => {
  console.log("📅 API: Caricamento statistiche settimanali...");

  const response = await fetch(API_ENDPOINTS.PROFILE.STATS_WEEKLY, {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Errore durante il caricamento delle statistiche settimanali");
  }

  const data = await response.json();
  console.log("✅ API: Statistiche settimanali ricevute:", data);

  return data;
};

/**
 * Ottiene le statistiche mensili
 */
export const getMonthlyStats = async (token: string): Promise<MonthlyStats> => {
  console.log("📆 API: Caricamento statistiche mensili...");

  const response = await fetch(API_ENDPOINTS.PROFILE.STATS_MONTHLY, {
    method: "GET",
    headers: createAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Errore durante il caricamento delle statistiche mensili");
  }

  const data = await response.json();
  console.log("✅ API: Statistiche mensili ricevute:", data);

  return data;
};
