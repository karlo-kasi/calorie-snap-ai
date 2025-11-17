import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  onboardingCompleted?: boolean;
  profile?: {
    name: string,
    surname: string,
    age?: number;
    height?: number;
    weight?: number;
    gender?: "male" | "female" | "other";
    activityLevel?: string;
    goal?: string;
    dailyCalories?: number;
  };
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

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

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
  const [isLoading, setIsLoading] = useState(true);

  // Funzione per ricaricare i dati utente dal server
  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem("auth_token");

      if (!storedToken) {
        console.log("⚠️ refreshUser: Nessun token disponibile");
        return;
      }

      console.log("🔄 refreshUser: Ricaricamento dati utente dal server...");

      const response = await fetch("http://localhost:3000/api/profile/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        console.error("❌ refreshUser: Errore nella risposta del server");
        // Se il token non è valido, pulisci tutto
        if (response.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
        throw new Error("Errore nel caricamento dei dati utente");
      }

      const data = await response.json();
      console.log("✅ refreshUser: Dati ricevuti dal server:", data);

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("💾 refreshUser: Dati aggiornati in localStorage");
      }
    } catch (error) {
      console.error("❌ refreshUser: Errore durante il caricamento:", error);
    }
  };

  // Carica il token e le info utente dal localStorage all'avvio
  useEffect(() => {
    const loadInitialData = async () => {
      console.log("🔄 AuthContext useEffect - Caricamento dati...");
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("user");

        console.log("📦 storedToken:", storedToken);
        console.log("📦 storedUser:", storedUser);

        if (storedToken) {
          setToken(storedToken);

          // Se abbiamo il token, prova a ricaricare i dati dal server
          // Questo assicura che i dati siano sempre aggiornati
          try {
            const response = await fetch("http://localhost:3000/api/profile/me", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              console.log("✅ Dati aggiornati dal server:", data);

              if (data.success && data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                console.log("💾 Dati salvati dal server");
              }
            } else if (response.status === 401) {
              // Token scaduto o non valido
              console.log("⚠️ Token non valido, uso dati localStorage");
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
              setToken(null);
              setUser(null);
            } else if (storedUser) {
              // Server non disponibile, usa i dati del localStorage come fallback
              console.log("⚠️ Server non disponibile, uso dati localStorage");
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            }
          } catch (fetchError) {
            // Errore di rete, usa i dati del localStorage come fallback
            console.log("⚠️ Errore di rete, uso dati localStorage:", fetchError);
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            }
          }
        } else {
          console.log("❌ Nessun token nel localStorage");
        }
      } catch (error) {
        console.error(
          "Errore nel caricamento dei dati di autenticazione:",
          error
        );
        // Pulisci il localStorage se i dati sono corrotti
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 Tentativo di login per:", email);

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 Risposta login:", response.status, response.ok);

      if (!response.ok) {
        throw new Error("Login fallito");
      }

      const data = await response.json();
      console.log("📋 Dati ricevuti dal backend:", data);
      console.log("  - Token:", data.token);
      console.log("  - User:", data.user);

      // Adatta la risposta del backend al formato aspettato dal frontend
      let user: User;

      if (data.user) {
        // Il backend restituisce già l'oggetto user completo
        user = data.user;
      } else {
        // Il backend restituisce userId e email separatamente - creiamo l'oggetto user
        user = {
          id: data.userId,
          email: data.email,
          name: data.name || data.email.split("@")[0], // Usa il nome o la parte prima di @ come fallback
          onboardingCompleted: false, // Default per un nuovo login
        };
      }

      console.log("👤 Oggetto user creato:", user);

      // Salva token e user
      setToken(data.token);
      setUser(user);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("💾 Dati salvati nel localStorage:");
      console.log("  - Token salvato:", localStorage.getItem("auth_token"));
      console.log("  - User salvato:", localStorage.getItem("user"));
    } catch (error) {
      console.error("Errore durante il login:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // TODO: Sostituire con chiamata API reale
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registrazione fallita");
      }

      const data = await response.json();

      // Salva token e user
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  };

  const completeOnboarding = async (data: OnboardingData) => {
    try {
      if (!token) {
        throw new Error("Utente non autenticato");
      }

      // Adatta i dati per il backend
      const backendData = {
        nome: data.name,
        cognome: data.surname,
        età: data.age,
        altezza: data.height,
        peso: data.weight,
        sesso: data.gender === "female" ? "donna" : data.gender === "male" ? "uomo" : "altro",
        attività: data.activityLevel,
        goal: data.goal,
      };

      console.log("📋 Dati adattati per il backend:", backendData);

      // Chiamata API per completare l'onboarding
      const response = await fetch(
        "http://localhost:3000/api/profile/onboarding",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(backendData),
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante il completamento dell'onboarding");
      }

      const result = await response.json();
      console.log("✅ Risposta API onboarding:", result);

      // Invece di costruire manualmente l'utente, ricarica i dati dal server
      // Questo garantisce che i dati siano sempre consistenti con il backend
      if (result.success && result.user) {
        console.log("📦 Aggiornamento user da risposta onboarding:", result.user);
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
      } else {
        // Fallback: ricarica i dati dal server usando refreshUser
        console.log("🔄 Ricaricamento dati utente dal server...");
        await refreshUser();
      }
    } catch (error) {
      console.error("Errore durante il completamento dell'onboarding:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    completeOnboarding,
    refreshUser,
    isAuthenticated: !!token,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
