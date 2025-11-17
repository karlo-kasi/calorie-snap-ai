/**
 * Interfacce TypeScript per User e dati correlati
 */

import { Meal, DailyStats } from "./meal.types";

export interface UserProfile {
  name: string;
  surname: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: "male" | "female" | "other";
  activityLevel?: string;
  goal?: string;
  dailyCalories?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  onboardingCompleted?: boolean;
  profile?: UserProfile;
}

export interface OnboardingData {
  name: string;
  surname: string;
  age: number;
  height: number;
  weight: number;
  gender: "male" | "female" | "other";
  activityLevel: string;
  goal: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  meals: Meal[];
  dailyStats: DailyStats | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshMeals: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isMealsLoading: boolean;
}
