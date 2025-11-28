/**
 * Interfacce TypeScript per Meal e dati correlati
 */

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface Macros {
  proteins: number;
  carbohydrates: number;
  fats: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  calories: number;
  macros: Macros;
}

export interface Meal {
  _id: string;
  userId: string;
  mealType: MealType;
  date: string;
  dishName: string;
  totalWeight: number;
  ingredients: Ingredient[];
  totalCalories: number;
  totalMacros: Macros;
  confidence: ConfidenceLevel;
  preparationNotes?: string;
  imageBase64?: string;
  createdAt: string;
}

export interface DailyStats {
  consumed: {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };
  target?: number;
  remaining?: number;
  activeDays?: number;
}

export interface CreateMealRequest {
  imageBase64: string;
  mediaType: string;
  mealType: MealType;
}

export interface MealResponse {
  success: boolean;
  message?: string;
  data?: Meal;
}

export interface MealsListResponse {
  success: boolean;
  count: number;
  total?: number;
  data: Meal[];
  dailyStats?: DailyStats;
}
