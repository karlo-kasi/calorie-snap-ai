import { useState, useMemo, useEffect, useCallback } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FoodCard } from "../components/FoodCard/FoodCard";
import { MealDetailModal } from "../components/MealDetailModal/MealDetailModal";
import { BookOpen, ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { format, addDays, subDays, isToday, isYesterday, isAfter, startOfDay } from "date-fns";
import { it } from "date-fns/locale";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
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

// Abbreviazioni mesi italiani per formato compatto
const MONTH_ABBR: Record<string, string> = {
  gennaio: "gen", febbraio: "feb", marzo: "mar", aprile: "apr",
  maggio: "mag", giugno: "giu", luglio: "lug", agosto: "ago",
  settembre: "set", ottobre: "ott", novembre: "nov", dicembre: "dic",
};

// Sezioni pasti con titoli localizzati
const MEAL_SECTIONS = [
  { key: "breakfast" as MealType, title: "Colazione" },
  { key: "lunch" as MealType, title: "Pranzo" },
  { key: "dinner" as MealType, title: "Cena" },
  { key: "snack" as MealType, title: "Spuntini" },
];

// Formatta la data: "Oggi", "Ieri" o "lunedì 15 gen"
const formatDateLabel = (date: Date): string => {
  if (isToday(date)) return "Oggi";
  if (isYesterday(date)) return "Ieri";

  const dayName = format(date, "EEEE", { locale: it });
  const day = format(date, "d");
  const monthFull = format(date, "MMMM", { locale: it }).toLowerCase();
  const monthAbbr = MONTH_ABBR[monthFull] || monthFull.substring(0, 3);

  return `${dayName} ${day} ${monthAbbr}`;
};

export const Diary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, token, refreshMeals, meals: authMeals, dailyStats: authDailyStats, isMealsLoading: authMealsLoading } = useAuth();

  // State per UI
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [mealToDelete, setMealToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State per pasti di date passate (oggi viene da AuthContext)
  const [dateMeals, setDateMeals] = useState<Meal[]>([]);
  const [dateDailyStats, setDateDailyStats] = useState<DailyStats | null>(null);
  const [isLoadingDate, setIsLoadingDate] = useState(false);

  // Determina se stiamo visualizzando oggi o una data passata
  const isTodaySelected = isToday(selectedDate);
  const meals = isTodaySelected ? authMeals : dateMeals;
  const dailyStats = isTodaySelected ? authDailyStats : dateDailyStats;
  const isMealsLoading = isTodaySelected ? authMealsLoading : isLoadingDate;

  // Raggruppa pasti per tipo (colazione, pranzo, cena, snack)
  const groupedMeals = useMemo(() => {
    const groups: Record<MealType, Meal[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
    meals.forEach((meal) => groups[meal.mealType]?.push(meal));
    return groups;
  }, [meals]);

  // Calcola calorie e obiettivi
  const totalCalories = dailyStats?.consumed.calories || meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const targetCalories = user?.profile?.dailyCalories || dailyStats?.target || 2000;
  const remainingCalories = targetCalories - totalCalories;
  const isNextDayDisabled = isAfter(startOfDay(addDays(selectedDate, 1)), startOfDay(new Date()));

  // Ricarica pasti (oggi da AuthContext, altre date da API)
  const reloadMeals = useCallback(async () => {
    if (!token) return;

    setIsLoadingDate(true);
    try {
      if (isTodaySelected) {
        await refreshMeals();
      } else {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const response = await mealService.getMealsByDate(token, dateString);
        if (response.success) {
          setDateMeals(response.data);
          setDateDailyStats(response.dailyStats || null);
        }
      }
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile caricare i pasti", variant: "destructive" });
    } finally {
      setIsLoadingDate(false);
    }
  }, [token, selectedDate, isTodaySelected, refreshMeals, toast]);

  // Carica pasti al cambio data
  useEffect(() => {
    reloadMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, token]);

  const handleDeleteMeal = async () => {
    if (!mealToDelete || !token) return;

    setIsDeleting(true);
    try {
      await mealService.deleteMeal(token, mealToDelete);
      toast({ title: "Pasto eliminato", description: "Il pasto è stato rimosso con successo" });
      await reloadMeals();
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile eliminare il pasto. Riprova.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setMealToDelete(null);
    }
  };

  const handleRefresh = async () => {
    try {
      await reloadMeals();
      toast({ title: "Aggiornato", description: "Pasti aggiornati con successo" });
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile aggiornare i pasti", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Diario Alimentare</h1>
        </div>
        <div className="flex items-center gap-2">
          {isMealsLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isMealsLoading} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <RefreshCw className={`h-4 w-4 ${isMealsLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Date Navigator */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate((d) => subDays(d, 1))} disabled={isMealsLoading} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="font-semibold">{formatDateLabel(selectedDate)}</div>
            <div className="text-sm text-muted-foreground">{Math.round(totalCalories)} kcal totali</div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedDate((d) => addDays(d, 1))} disabled={isNextDayDisabled || isMealsLoading} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Daily Summary */}
      <Card className="p-4 gradient-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-lg font-semibold">{Math.round(targetCalories)} kcal</div>
            <div className="text-sm opacity-90">Target</div>
          </div>
          <div className="text-2xl font-bold">−</div>
          <div className="text-center">
            <div className="text-lg font-semibold">{Math.round(totalCalories)} kcal</div>
            <div className="text-sm opacity-90">Consumate</div>
          </div>
          <div className="text-2xl font-bold">=</div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${remainingCalories < 0 ? "text-warning" : ""}`}>
              {Math.round(remainingCalories)} kcal
            </div>
            <div className="text-sm opacity-90">{remainingCalories >= 0 ? "Rimaste" : "In eccesso"}</div>
          </div>
        </div>
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className={`h-full transition-all ${remainingCalories < 0 ? "bg-warning" : "bg-white"}`} style={{ width: `${Math.min((totalCalories / targetCalories) * 100, 100)}%` }} />
        </div>
      </Card>

      {/* Meal Sections */}
      {MEAL_SECTIONS.map((section) => {
        const sectionMeals = groupedMeals[section.key];
        const sectionCalories = sectionMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);

        return (
          <div key={section.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                {section.title}
                {sectionCalories > 0 && <span className="text-sm text-muted-foreground">({Math.round(sectionCalories)} kcal)</span>}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/add")} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                + Aggiungi
              </Button>
            </div>

            <div className="space-y-2">
              {sectionMeals.length > 0 ? (
                sectionMeals.map((meal) => (
                  <div key={meal._id} onClick={() => setSelectedMeal(meal)} className="cursor-pointer transition-all hover:bg-muted/50 rounded-lg">
                    <FoodCard
                      id={meal._id}
                      name={meal.dishName}
                      calories={meal.totalCalories}
                      quantity={`${meal.totalWeight}g`}
                      time={format(new Date(meal.date), "HH:mm")}
                      image={meal.imageBase64 ? `data:image/jpeg;base64,${meal.imageBase64}` : undefined}
                      onEdit={() => setSelectedMeal(meal)}
                      onDelete={(id) => setMealToDelete(id)}
                    />
                  </div>
                ))
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Nessun cibo aggiunto per {section.title.toLowerCase()}</p>
                  <Button variant="ghost" size="sm" className="mt-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={() => navigate("/add")}>
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
            {isTodaySelected ? "Nessun pasto registrato oggi" : "Nessun pasto registrato per questa data"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {isTodaySelected ? "Inizia a tracciare i tuoi pasti per monitorare le calorie" : "Non ci sono pasti registrati per questo giorno"}
          </p>
          {isTodaySelected && <Button onClick={() => navigate("/add")}>+ Aggiungi primo pasto</Button>}
        </Card>
      )}

      <MealDetailModal meal={selectedMeal} open={!!selectedMeal} onClose={() => setSelectedMeal(null)} />

      <AlertDialog open={!!mealToDelete} onOpenChange={() => setMealToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo pasto?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il pasto verrà eliminato definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMeal} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Eliminazione...</> : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
