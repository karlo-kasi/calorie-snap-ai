import React from "react";
import { CalorieCard } from "../components/CalorieCard/CalorieCard";
import { FoodCard } from "../components/FoodCard/FoodCard";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Plus, Camera, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-food.jpg";
import { OnboardingModal } from "../components/OnboardingModal";
import { useAuth } from "../contexts/AuthContext";

export const Home = () => {
  const { user, token, meals, isAuthenticated, isLoading } = useAuth();

  console.log("🏠 Home - Debug Info:");
  console.log("  - User:", user);
  console.log("  - Token:", token);
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - isLoading:", isLoading);
  console.log("  - localStorage token:", localStorage.getItem("auth_token"));
  console.log("  - localStorage user:", localStorage.getItem("user"));

  // Mostra il modal se l'utente non ha completato l'onboarding
  const shouldShowOnboarding = user && !user.onboardingCompleted;

  // Se sta ancora caricando, mostra un loading
  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  // Se non è autenticato, reindirizza al login
  if (!isAuthenticated) {
    console.log("❌ Utente non autenticato, dovrebbe essere reindirizzato");
    return <div>Non autenticato</div>;
  }

  // Mock data - in real app this would come from state/API
  const calorieData = {
    consumed: 1420,
    goal: user?.profile?.dailyCalories,
    remaining: (user?.profile?.dailyCalories || 2000) - 1420,
  };

  const recentFoods = [
    {
      id: "1",
      name: "Insalata mista",
      calories: 150,
      quantity: "1 porzione",
      time: "13:30",
    },
    {
      id: "2",
      name: "Pollo alla griglia",
      calories: 280,
      quantity: "150g",
      time: "12:45",
    },
  ];

  const quickActions = [
    { icon: Camera, label: "Scatta foto", to: "/add?mode=photo" },
    { icon: Plus, label: "Aggiungi manuale", to: "/add?mode=manual" },
    { icon: Upload, label: "Importa", to: "/add?mode=import" },
  ];

  console.log("🎯 shouldShowOnboarding:", shouldShowOnboarding);

  return (
    <div className="space-y-6">
      {/* Container con layout a 2 colonne con flex */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Colonna sinistra */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Welcome Section - PIÙ GRANDE */}
          <Card className="p-8 gradient-primary text-primary-foreground overflow-hidden relative min-h-[200px] flex items-center">
            <div className="relative z-10 space-y-3">
              <h1 className="text-3xl font-bold">
                Ciao {(user?.profile?.name || user?.name)?.trim()}! 👋
              </h1>
              <p className="text-lg opacity-90">
                Oggi stai facendo un ottimo lavoro!
              </p>
              <p className="text-sm opacity-80">
                Continua così per raggiungere i tuoi obiettivi
              </p>
            </div>
            <img
              src={heroImage}
              alt="Healthy foods"
              className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20"
            />
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 text-lg">Azioni Rapide</h2>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.to}>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 w-full hover:bg-primary/5 hover:border-primary/30"
                  >
                    <action.icon size={24} />
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Colonna destra */}
        <div className="flex-1 flex">
          {/* Calorie Tracking */}
          <div className="flex-1">
            <CalorieCard {...calorieData} />
          </div>
        </div>
      </div>

      {/* Daily Tips */}
      <Card className="p-4 bg-gradient-to-r from-energy/10 to-warning/10 border-energy/20">
        <h3 className="font-medium mb-2 text-energy-foreground">
          💡 Consiglio del giorno
        </h3>
        <p className="text-sm text-muted-foreground">
          Bere un bicchiere d'acqua prima dei pasti può aiutarti a sentirti più
          sazio e controllare le porzioni.
        </p>
      </Card>

      {/* Recent Foods */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Pasti Recenti</h2>
          <Link to="/diary">
            <Button variant="ghost" size="sm">
              Vedi tutto
            </Button>
          </Link>
        </div>

        {/* Controlla se ci sono meals */}
        {meals && meals.length > 0 ? (
          meals
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .slice(0, 3)
            .map((meal) => (
              <FoodCard
                key={meal._id}
                id={meal._id}
                name={meal.dishName}
                calories={meal.totalCalories}
                quantity={`${meal.totalWeight}g`}
                time={new Date(meal.createdAt).toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nessun pasto registrato oggi. Inizia ad aggiungerne uno! 🍽️
            </p>
            <Link to="/add">
              <Button className="mt-3" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi pasto
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Onboarding Modal */}
      {user && <OnboardingModal open={shouldShowOnboarding || false} />}
    </div>
  );
};
