import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  OnboardingData,
  AuthContextType,
} from "../types/user.types";
import { Meal, DailyStats } from "../types/meal.types";
import * as authService from "../services/api/auth.service";
import * as mealService from "../services/api/meal.service";

// Export dei tipi per retrocompatibilità
export type { User, OnboardingData } from "../types/user.types";
export type { Meal, DailyStats } from "../types/meal.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMealsLoading, setIsMealsLoading] = useState(false);

  /**
   * Salva user e token nello stato e localStorage
   */
  const saveAuthData = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("auth_token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /**
   * Pulisce i dati di autenticazione
   */
  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  };

  /**
   * Ricarica i dati utente dal server
   */
  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem("auth_token");

      if (!storedToken) {
        console.log("⚠️ refreshUser: Nessun token disponibile");
        return;
      }

      const data = await authService.getCurrentUser(storedToken);

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("💾 refreshUser: Dati aggiornati");
      }
    } catch (error) {
      console.error("❌ refreshUser: Errore:", error);

      // Se il token non è valido, pulisci tutto
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        clearAuthData();
      }
    }
  };

  /**
   * Ricarica i pasti di oggi dal server
   */
  const refreshMeals = async () => {
    try {
      const storedToken = localStorage.getItem("auth_token");

      if (!storedToken) {
        console.log("⚠️ refreshMeals: Nessun token disponibile");
        return;
      }

      setIsMealsLoading(true);

      const data = await mealService.getTodayMeals(storedToken);

      if (data.success) {
        setMeals(data.data);
        setDailyStats(data.dailyStats || null);
        console.log("💾 refreshMeals: Pasti aggiornati");
      }
    } catch (error) {
      console.error("❌ refreshMeals: Errore:", error);

      // Se il token non è valido, pulisci tutto
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        clearAuthData();
      }
    } finally {
      setIsMealsLoading(false);
    }
  };

  /**
   * Carica i dati all'avvio dell'app
   */
  useEffect(() => {
    const loadInitialData = async () => {
      console.log("🔄 AuthContext: Caricamento dati iniziali...");

      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("user");

        if (!storedToken) {
          console.log("❌ Nessun token nel localStorage");
          setIsLoading(false);
          return;
        }

        setToken(storedToken);

        // Prova a ricaricare i dati dal server per sincronizzare
        try {
          const data = await authService.getCurrentUser(storedToken);

          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("✅ Dati sincronizzati dal server");

            // Carica anche i pasti di oggi
            try {
              const mealsData = await mealService.getTodayMeals(storedToken);
              if (mealsData.success) {
                setMeals(mealsData.data);
                setDailyStats(mealsData.dailyStats || null);
                console.log("✅ Pasti di oggi caricati");
              }
            } catch (mealsError) {
              console.log("⚠️ Errore caricamento pasti:", mealsError);
              // Non blocchiamo l'app se i pasti non si caricano
            }
          }
        } catch (fetchError) {
          console.log("⚠️ Errore sync server, uso localStorage:", fetchError);

          // Se il token è scaduto, pulisci
          if (
            fetchError instanceof Error &&
            fetchError.message === "UNAUTHORIZED"
          ) {
            clearAuthData();
          } else if (storedUser) {
            // Fallback a localStorage se server non disponibile
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("❌ Errore caricamento dati:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  /**
   * Login
   */
  const login = async (email: string, password: string) => {
    try {
      const data = await authService.loginUser(email, password);
      saveAuthData(data.user, data.token);
    } catch (error) {
      console.error("❌ Errore durante il login:", error);
      throw error;
    }
  };

  /**
   * Registrazione
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await authService.registerUser(name, email, password);
      saveAuthData(data.user, data.token);
    } catch (error) {
      console.error("❌ Errore durante la registrazione:", error);
      throw error;
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    clearAuthData();
  };

  /**
   * Completa onboarding
   */
  const completeOnboarding = async (data: OnboardingData) => {
    try {
      if (!token) {
        throw new Error("Utente non autenticato");
      }

      const result = await authService.completeOnboarding(token, data);

      // Aggiorna i dati utente con la risposta
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        console.log("✅ Onboarding completato");
      } else {
        // Fallback: ricarica dal server
        await refreshUser();
      }
    } catch (error) {
      console.error("❌ Errore durante l'onboarding:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    meals,
    dailyStats,
    login,
    register,
    logout,
    completeOnboarding,
    refreshUser,
    refreshMeals,
    isAuthenticated: !!token,
    isLoading,
    isMealsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
