import React, { useState, useMemo, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FoodCard } from "../components/FoodCard/FoodCard";
import { MealDetailModal } from "../components/MealDetailModal/MealDetailModal";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isToday,
  isYesterday,
  isAfter,
  startOfDay,
} from "date-fns";
import { it } from "date-fns/locale";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import * as mealService from "../services/api/meal.service";
import type { Meal, MealType, DailyStats } from "../types/meal.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export const Diary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Abbreviazioni mesi italiani
  const monthAbbreviations: Record<string, string> = {
    'gennaio': 'gen',
    'febbraio': 'feb',
    'marzo': 'mar',
    'aprile': 'apr',
    'maggio': 'mag',
    'giugno': 'giu',
    'luglio': 'lug',
    'agosto': 'ago',
    'settembre': 'set',
    'ottobre': 'ott',
    'novembre': 'nov',
    'dicembre': 'dic'
  };

  // Funzione per formattare la data con "Oggi", "Ieri" o data abbreviata
  const formatDateLabel = (date: Date): string => {
    if (isToday(date)) {
      return 'Oggi';
    }
    if (isYesterday(date)) {
      return 'Ieri';
    }

    // Formatta la data normale con abbreviazione del mese
    const dayName = format(date, "EEEE", { locale: it });
    const day = format(date, "d");
    const monthFull = format(date, "MMMM", { locale: it }).toLowerCase();
    const monthAbbr = monthAbbreviations[monthFull] || monthFull.substring(0, 3);

    return `${dayName} ${day} ${monthAbbr}`;
  };

  // State per i pasti della data selezionata
  const [dateMeals, setDateMeals] = useState<Meal[]>([]);
  const [dateDailyStats, setDateDailyStats] = useState<DailyStats | null>(null);
  const [isLoadingDate, setIsLoadingDate] = useState(false);

  // Prendi tutti i dati da AuthContext in una singola chiamata
  const {
    user,
    token,
    refreshMeals,
    meals: authMeals,
    dailyStats: authDailyStats,
    isMealsLoading: authMealsLoading,
  } = useAuth();
  const { toast } = useToast();

  // Carica i pasti quando cambia la data selezionata
  useEffect(() => {
    const loadMealsForDate = async () => {
      if (!token) return;

      setIsLoadingDate(true);
      try {
        const dateString = format(selectedDate, "yyyy-MM-dd");

        // Se è oggi, usa refreshMeals dall'AuthContext
        if (isToday(selectedDate)) {
          await refreshMeals();
          setIsLoadingDate(false);
          return;
        }

        // Altrimenti carica i pasti per la data specifica
        const response = await mealService.getMealsByDate(token, dateString);

        if (response.success) {
          setDateMeals(response.data);
          setDateDailyStats(response.dailyStats || null);
        }
      } catch (error) {
        console.error("Errore caricamento pasti per data:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i pasti per questa data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingDate(false);
      }
    };

    loadMealsForDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, token]);

  // Determina quali dati usare (oggi dall'AuthContext o data specifica)
  const meals = isToday(selectedDate) ? authMeals : dateMeals;
  const dailyStats = isToday(selectedDate) ? authDailyStats : dateDailyStats;
  const isMealsLoading = isToday(selectedDate)
    ? authMealsLoading
    : isLoadingDate;

  // Filtra e raggruppa i pasti per tipo
  const groupedMeals = useMemo(() => {
    const groups: Record<MealType, Meal[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    meals.forEach((meal) => {
      if (groups[meal.mealType]) {
        groups[meal.mealType].push(meal);
      }
    });

    return groups;
  }, [meals]);

  // Calcola calorie totali (usa dailyStats se disponibile, altrimenti calcola)
  const totalCalories =
    dailyStats?.consumed.calories ||
    meals.reduce((sum, meal) => sum + meal.totalCalories, 0);

  const targetCalories =
    user?.profile?.dailyCalories || dailyStats?.target || 2000;
  const remainingCalories = targetCalories - totalCalories;

  const mealSections = [
    {
      key: "breakfast" as MealType,
      title: "Colazione",
      icon: "🌅",
      meals: groupedMeals.breakfast,
    },
    {
      key: "lunch" as MealType,
      title: "Pranzo",
      icon: "🍽️",
      meals: groupedMeals.lunch,
    },
    {
      key: "dinner" as MealType,
      title: "Cena",
      icon: "🌙",
      meals: groupedMeals.dinner,
    },
    {
      key: "snack" as MealType,
      title: "Spuntini",
      icon: "🍎",
      meals: groupedMeals.snack,
    },
  ];

  // Calcola calorie per sezione
  const getSectionCalories = (meals: Meal[]) => {
    return meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  };

  // Handler per visualizzare dettaglio pasto
  const handleViewMeal = (mealId: string) => {
    const meal = meals.find((m) => m._id === mealId);
    if (meal) {
      setSelectedMeal(meal);
    }
  };

  // Handler per eliminare pasto
  const handleDeleteMeal = async () => {
    if (!mealToDelete || !token) return;

    setIsDeleting(true);

    try {
      await mealService.deleteMeal(token, mealToDelete);

      toast({
        title: "Pasto eliminato",
        description: "Il pasto è stato rimosso con successo",
      });

      // Ricarica i pasti per la data corrente
      if (isToday(selectedDate)) {
        await refreshMeals();
      } else {
        // Ricarica i pasti per la data specifica
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const response = await mealService.getMealsByDate(token, dateString);
        if (response.success) {
          setDateMeals(response.data);
          setDateDailyStats(response.dailyStats || null);
        }
      }
    } catch (error) {
      console.error("Errore eliminazione pasto:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il pasto. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setMealToDelete(null);
    }
  };

  // Handler per refresh manuale
  const handleRefresh = async () => {
    try {
      if (isToday(selectedDate)) {
        await refreshMeals();
      } else {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const response = await mealService.getMealsByDate(token!, dateString);
        if (response.success) {
          setDateMeals(response.data);
          setDateDailyStats(response.dailyStats || null);
        }
      }
      toast({
        title: "Aggiornato",
        description: "Pasti aggiornati con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare i pasti",
        variant: "destructive",
      });
    }
  };

  // Handler per navigazione date
  const handlePreviousDay = () => {
    setSelectedDate((prevDate) => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    const nextDate = addDays(selectedDate, 1);
    const today = startOfDay(new Date());

    // Permetti di andare avanti solo se nextDate è <= oggi
    if (!isAfter(startOfDay(nextDate), today)) {
      setSelectedDate(nextDate);
    }
  };

  // Verifica se il pulsante "avanti" deve essere disabilitato
  const isNextDayDisabled = isAfter(
    startOfDay(addDays(selectedDate, 1)),
    startOfDay(new Date())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Diario Alimentare</h1>
        </div>
        <div className="flex items-center gap-2">
          {isMealsLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isMealsLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isMealsLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Date Navigator */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousDay}
            disabled={isMealsLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <div className="font-semibold">
              {formatDateLabel(selectedDate)}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(totalCalories)} kcal totali
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextDay}
            disabled={isNextDayDisabled || isMealsLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Daily Summary */}
      <Card className="p-4 gradient-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-semibold">
              {Math.round(totalCalories)} kcal
            </div>
            <div className="text-sm opacity-90">
              {isToday(selectedDate) ? "Consumate oggi" : "Consumate"}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-lg font-semibold ${
                remainingCalories < 0 ? "text-warning" : ""
              }`}
            >
              {Math.round(Math.abs(remainingCalories))} kcal
            </div>
            <div className="text-sm opacity-90">
              {remainingCalories >= 0 ? "Rimaste" : "In eccesso"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              remainingCalories < 0 ? "bg-warning" : "bg-white"
            }`}
            style={{
              width: `${Math.min(
                (totalCalories / targetCalories) * 100,
                100
              )}%`,
            }}
          />
        </div>
      </Card>

      {/* Meal Sections */}
      {mealSections.map((section) => {
        const sectionCalories = getSectionCalories(section.meals);

        return (
          <div key={section.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <span>{section.icon}</span>
                {section.title}
                {sectionCalories > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({Math.round(sectionCalories)} kcal)
                  </span>
                )}
              </h2>
              <Button variant="ghost" size="sm">
                + Aggiungi
              </Button>
            </div>

            <div className="space-y-2">
              {section.meals.length > 0 ? (
                section.meals.map((meal) => (
                  <div
                    key={meal._id}
                    onClick={() => handleViewMeal(meal._id)}
                    className="cursor-pointer"
                  >
                    <FoodCard
                      id={meal._id}
                      name={meal.dishName}
                      calories={meal.totalCalories}
                      quantity={`${meal.totalWeight}g`}
                      time={format(new Date(meal.date), "HH:mm")}
                      image={meal.imageBase64 ? `data:image/jpeg;base64,${meal.imageBase64}` : undefined}
                      onEdit={(id) => handleViewMeal(id)}
                      onDelete={(id) => setMealToDelete(id)}
                    />
                  </div>
                ))
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nessun cibo aggiunto per {section.title.toLowerCase()}
                  </p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    + Aggiungi cibo
                  </Button>
                </Card>
              )}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {meals.length === 0 && !isMealsLoading && (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="font-semibold text-lg mb-2">
            {isToday(selectedDate)
              ? "Nessun pasto registrato oggi"
              : "Nessun pasto registrato per questa data"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isToday(selectedDate)
              ? "Inizia a tracciare i tuoi pasti per monitorare le calorie"
              : "Non ci sono pasti registrati per questo giorno"}
          </p>
          {isToday(selectedDate) && <Button>+ Aggiungi primo pasto</Button>}
        </Card>
      )}

      {/* Modal Dettaglio Pasto */}
      <MealDetailModal
        meal={selectedMeal}
        open={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />

      {/* Dialog Conferma Eliminazione */}
      <AlertDialog
        open={!!mealToDelete}
        onOpenChange={() => setMealToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo pasto?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il pasto verrà eliminato
              definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMeal}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminazione...
                </>
              ) : (
                "Elimina"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
