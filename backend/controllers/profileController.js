import { caloriesCalculator } from "../services/caloriesCalculator.js";
import User from "../models/User.js";

export const setupInformation = async (req, res) => {
  try {
    console.log("📥 Dati ricevuti dal frontend:", req.body);
    console.log("👤 UserId dal middleware:", req.userId);

    const { nome, cognome, età, altezza, peso, sesso, attività, goal } =
      req.body;

    if (
      !nome ||
      !cognome ||
      !età ||
      !altezza ||
      !peso ||
      !sesso ||
      !attività ||
      !goal
    ) {
      console.log("❌ Dati mancanti!");
      return res.status(400).json({ message: "Dati mancanti!" });
    }

    const userId = req.userId;

    if (!userId) {
      console.log("❌ UserId mancante!");
      return res.status(401).json({ message: "Utente non autenticato" });
    }

    // Calcola le calorie
    console.log("🧮 Calcolo calorie con parametri:", { età, altezza, peso, sesso, attività, goal });
    const objectCalories = caloriesCalculator(
      età,
      altezza,
      peso,
      sesso,
      attività,
      goal
    );
    console.log("✅ Calorie calcolate:", objectCalories);

    // Mappa il gender correttamente
    let gender = "male";
    if (sesso.toLowerCase() === "donna") {
      gender = "female";
    } else if (sesso.toLowerCase() === "altro") {
      gender = "other";
    }

    // Update con campi nested
    console.log("💾 Aggiornamento utente con ID:", userId);
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username: `${nome} ${cognome}`,
        "profile.name": nome,
        "profile.surname": cognome,
        "profile.age": età,
        "profile.gender": gender,
        "profile.weight": peso,
        "profile.height": altezza,
        "profile.activityLevel": attività,
        "goals.targetCalories": objectCalories.TARGET,
        "goals.weeklyGoal": goal,
        "goals.onboardingCompleted": true,
      },
      { new: true, runValidators: true }
    );
    console.log("✅ Utente aggiornato:", user ? "Success" : "Not found");

    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json({
      message: "Profilo aggiornato con successo",
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        goals: user.goals,
        calories: objectCalories,
      },
    });
  } catch (err) {
    console.error("❌ Errore in setupInformation:", err);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Recupera profilo utente
    const user = await User.findById(userId).select("profile goals");

    if (!user || !user.goals.onboardingCompleted) {
      return res.status(400).json({
        success: false,
        message: "Completa l'onboarding prima di accedere alla dashboard",
      });
    }

    // Step 2: Calcola inizio e fine giornata
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Step 3: Recupera pasti di oggi
    const todayMeals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .select("-imageBase64")
      .sort({ date: 1, mealType: 1 });

    // Step 4: Calcola statistiche giornaliere
    const consumed = todayMeals.reduce(
      (acc, meal) => {
        acc.calories += meal.totalCalories;
        acc.proteins += meal.totalMacros.proteins;
        acc.carbohydrates += meal.totalMacros.carbohydrates;
        acc.fats += meal.totalMacros.fats;
        return acc;
      },
      {
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      }
    );

    // Step 5: Calcola calorie rimanenti
    const targetCalories = user.goals.targetCalories || 0;
    const remaining = targetCalories - consumed.calories;

    // Step 6: Calcola percentuale progresso
    const percentage =
      targetCalories > 0
        ? Math.round((consumed.calories / targetCalories) * 100)
        : 0;

    // Step 7: Determina status
    let status = "on_track";
    if (percentage > 110) {
      status = "over";
    } else if (percentage < 80 && todayMeals.length > 0) {
      status = "under";
    }

    // Step 8: Risposta
    res.status(200).json({
      success: true,
      data: {
        user: {
          targetCalories,
          currentWeight: user.profile.weight || null,
          goalWeight: user.goals.targetWeight || null,
          activityLevel: user.profile.activityLevel || null,
        },
        today: {
          consumed: {
            calories: Math.round(consumed.calories),
            proteins: Math.round(consumed.proteins),
            carbohydrates: Math.round(consumed.carbohydrates),
            fats: Math.round(consumed.fats),
          },
          remaining: Math.round(remaining),
          mealsCount: todayMeals.length,
          meals: todayMeals,
        },
        progress: {
          percentage,
          status,
        },
      },
    });
  } catch (error) {
    console.error("❌ Errore in getDashboard:", error);
    next(error);
  }
};

// GET /stats/weekly
export const getWeeklyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Recupera target calorico
    const user = await User.findById(userId).select('goals.targetCalories');
    const targetCalories = user?.goals?.targetCalories || 0;

    // Step 2: Calcola inizio e fine settimana (ultimi 7 giorni)
    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 6); // Ultimi 7 giorni incluso oggi
    startOfWeek.setHours(0, 0, 0, 0);

    // Step 3: Recupera tutti i pasti della settimana
    const weekMeals = await Meal.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    })
      .select('date totalCalories totalMacros mealType')
      .sort({ date: 1 });

    // Step 4: Raggruppa pasti per giorno
    const dailyData = {};
    
    // Inizializza tutti i 7 giorni
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      const dateKey = day.toISOString().split('T')[0]; // YYYY-MM-DD
      
      dailyData[dateKey] = {
        date: dateKey,
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        mealsCount: 0
      };
    }

    // Popola con i dati reali
    weekMeals.forEach(meal => {
      const dateKey = meal.date.toISOString().split('T')[0];
      
      if (dailyData[dateKey]) {
        dailyData[dateKey].calories += meal.totalCalories;
        dailyData[dateKey].proteins += meal.totalMacros.proteins;
        dailyData[dateKey].carbohydrates += meal.totalMacros.carbohydrates;
        dailyData[dateKey].fats += meal.totalMacros.fats;
        dailyData[dateKey].mealsCount += 1;
      }
    });

    // Step 5: Converti in array e arrotonda valori
    const dailyArray = Object.values(dailyData).map(day => ({
      ...day,
      calories: Math.round(day.calories),
      proteins: Math.round(day.proteins),
      carbohydrates: Math.round(day.carbohydrates),
      fats: Math.round(day.fats),
      deficit: targetCalories - day.calories // Positivo = deficit, Negativo = surplus
    }));

    // Step 6: Calcola statistiche settimanali
    const totalCalories = dailyArray.reduce((sum, day) => sum + day.calories, 0);
    const daysWithMeals = dailyArray.filter(day => day.mealsCount > 0).length;
    const averageCalories = daysWithMeals > 0 
      ? Math.round(totalCalories / daysWithMeals) 
      : 0;

    const daysInDeficit = dailyArray.filter(day => 
      day.mealsCount > 0 && day.calories < targetCalories
    ).length;

    const daysInSurplus = dailyArray.filter(day => 
      day.mealsCount > 0 && day.calories > targetCalories
    ).length;

    const totalMeals = dailyArray.reduce((sum, day) => sum + day.mealsCount, 0);

    // Step 7: Risposta
    res.status(200).json({
      success: true,
      data: {
        period: {
          start: startOfWeek.toISOString().split('T')[0],
          end: endOfWeek.toISOString().split('T')[0],
          days: 7
        },
        summary: {
          averageCalories,
          totalMeals,
          daysTracked: daysWithMeals,
          daysInDeficit,
          daysInSurplus,
          targetCalories
        },
        dailyBreakdown: dailyArray
      }
    });

  } catch (error) {
    console.error("❌ Errore in getWeeklyStats:", error);
    next(error);
  }
};

// GET /stats/monthly
export const getMonthlyStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Recupera target calorico
    const user = await User.findById(userId).select('goals.targetCalories');
    const targetCalories = user?.goals?.targetCalories || 0;

    // Step 2: Calcola inizio e fine mese (ultimi 30 giorni)
    const endOfMonth = new Date();
    endOfMonth.setHours(23, 59, 59, 999);

    const startOfMonth = new Date();
    startOfMonth.setDate(startOfMonth.getDate() - 29); // Ultimi 30 giorni incluso oggi
    startOfMonth.setHours(0, 0, 0, 0);

    // Step 3: Recupera tutti i pasti del mese
    const monthMeals = await Meal.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    })
      .select('date totalCalories totalMacros mealType')
      .sort({ date: 1 });

    // Step 4: Raggruppa pasti per giorno
    const dailyData = {};
    
    // Inizializza tutti i 30 giorni
    for (let i = 0; i < 30; i++) {
      const day = new Date(startOfMonth);
      day.setDate(day.getDate() + i);
      const dateKey = day.toISOString().split('T')[0];
      
      dailyData[dateKey] = {
        date: dateKey,
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        mealsCount: 0
      };
    }

    // Popola con i dati reali
    monthMeals.forEach(meal => {
      const dateKey = meal.date.toISOString().split('T')[0];
      
      if (dailyData[dateKey]) {
        dailyData[dateKey].calories += meal.totalCalories;
        dailyData[dateKey].proteins += meal.totalMacros.proteins;
        dailyData[dateKey].carbohydrates += meal.totalMacros.carbohydrates;
        dailyData[dateKey].fats += meal.totalMacros.fats;
        dailyData[dateKey].mealsCount += 1;
      }
    });

    // Step 5: Converti in array e arrotonda valori
    const dailyArray = Object.values(dailyData).map(day => ({
      ...day,
      calories: Math.round(day.calories),
      proteins: Math.round(day.proteins),
      carbohydrates: Math.round(day.carbohydrates),
      fats: Math.round(day.fats),
      deficit: targetCalories - day.calories
    }));

    // Step 6: Calcola statistiche mensili
    const totalCalories = dailyArray.reduce((sum, day) => sum + day.calories, 0);
    const daysWithMeals = dailyArray.filter(day => day.mealsCount > 0).length;
    const averageCalories = daysWithMeals > 0 
      ? Math.round(totalCalories / daysWithMeals) 
      : 0;

    const daysInDeficit = dailyArray.filter(day => 
      day.mealsCount > 0 && day.calories < targetCalories
    ).length;

    const daysInSurplus = dailyArray.filter(day => 
      day.mealsCount > 0 && day.calories > targetCalories
    ).length;

    const totalMeals = dailyArray.reduce((sum, day) => sum + day.mealsCount, 0);

    // Calcola totali macro del mese
    const totalMacros = dailyArray.reduce((acc, day) => ({
      proteins: acc.proteins + day.proteins,
      carbohydrates: acc.carbohydrates + day.carbohydrates,
      fats: acc.fats + day.fats
    }), { proteins: 0, carbohydrates: 0, fats: 0 });

    // Step 7: Risposta
    res.status(200).json({
      success: true,
      data: {
        period: {
          start: startOfMonth.toISOString().split('T')[0],
          end: endOfMonth.toISOString().split('T')[0],
          days: 30
        },
        summary: {
          averageCalories,
          totalCalories: Math.round(totalCalories),
          totalMeals,
          daysTracked: daysWithMeals,
          daysInDeficit,
          daysInSurplus,
          targetCalories,
          totalMacros: {
            proteins: Math.round(totalMacros.proteins),
            carbohydrates: Math.round(totalMacros.carbohydrates),
            fats: Math.round(totalMacros.fats)
          }
        },
        dailyBreakdown: dailyArray
      }
    });

  } catch (error) {
    console.error("❌ Errore in getMonthlyStats:", error);
    next(error);
  }
};
