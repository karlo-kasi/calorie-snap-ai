import mongoose from "mongoose";
import Meal from "../models/Meal.js";
import User from "../models/User.js";
import { analyzeFoodImage } from "../services/aiService.js";

/**
 * Controller per caricare un'immagine e analizzarla con Claude AI
 * POST /api/analysis/upload
 */
export const createMeals = async (req, res, next) => {
  try {
    const { imageBase64, mediaType, mealType } = req.body;
    const userId = req.userId;

    // Validazione input
    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "Immagine mancante.",
      });
    }

    if (!mealType) {
      return res.status(400).json({
        success: false,
        message: "Tipo di pasto mancante.",
      });
    }

    // Validazione mealType
    const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: `Tipo pasto non valido. Valori ammessi: ${validMealTypes.join(
          ", "
        )}`,
      });
    }

    // Validazione mediaType
    const validMediaTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (mediaType && !validMediaTypes.includes(mediaType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Formato immagine non supportato. Formati validi: ${validMediaTypes.join(
          ", "
        )}`,
      });
    }

    // Analisi immagine con AI
    console.log("🔍 Inizio analisi immagine con Claude AI...");
    const analysisResult = await analyzeFoodImage(
      imageBase64,
      mediaType || "image/jpeg"
    );

    // Verifica successo analisi
    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        message:
          analysisResult.error || "Errore durante l'analisi dell'immagine",
        details:
          process.env.NODE_ENV === "development"
            ? analysisResult.details
            : undefined,
      });
    }

    // Estrai dati dall'analisi AI
    const aiData = analysisResult.data;

    // Crea nuovo Meal
    const newMeal = await Meal.create({
      userId,
      mealType,
      dishName: aiData.dishName,
      totalWeight: aiData.totalWeight,
      ingredients: aiData.ingredients,
      totalCalories: aiData.totalCalories,
      totalMacros: aiData.totalMacros,
      confidence: aiData.confidence,
      preparationNotes: aiData.preparationNotes,
      imageBase64,
    });

    console.log(`✅ Pasto salvato con successo: ${newMeal._id}`);

    // Risposta successo
    res.status(201).json({
      success: true,
      message: "Pasto analizzato e salvato con successo",
      data: newMeal,
    });
  } catch (error) {
    console.error("❌ Errore in createMeal:", error);
    next(error);
  }
};

/**
 * Controller per ottenere lo storico delle analisi
 * GET /api/analysis/history
 * Query params: limit, skip, sortBy
 */
export const getAllMeals = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, sortBy = "date", order = "desc" } = req.query;

    // Converti in numeri
    const limitNum = parseInt(limit, 10);
    const skipNum = parseInt(skip, 10);

    // Validazione
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Il parametro 'limit' deve essere un numero tra 1 e 100",
      });
    }

    if (isNaN(skipNum) || skipNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Il parametro 'skip' deve essere un numero >= 0",
      });
    }

    // Ordinamento
    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    // Query FILTRATA per userId
    const meals = await Meal.find({ userId })
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skipNum)
      .select("-imageBase64"); // Escludi immagini per performance

    // Conta totale PER QUESTO UTENTE
    const total = await Meal.countDocuments({ userId });

    res.status(200).json({
      success: true,
      count: meals.length,
      total,
      data: meals,
    });
  } catch (error) {
    console.error("❌ Errore in getAnalysisHistory:", error);
    next(error);
  }
};

export const getTodayMeals = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Calcola inizio e fine giornata (00:00:00 - 23:59:59 di oggi)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Query pasti di oggi
    // NOTA: Include imageBase64 per visualizzare le foto nelle card
    const todayMeals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ date: 1, mealType: 1 }); // Ordina per orario e tipo pasto

    // Calcola statistiche giornaliere
    const stats = todayMeals.reduce(
      (acc, meal) => {
        acc.totalCalories += meal.totalCalories;
        acc.totalProteins += meal.totalMacros.proteins;
        acc.totalCarbs += meal.totalMacros.carbohydrates;
        acc.totalFats += meal.totalMacros.fats;
        return acc;
      },
      {
        totalCalories: 0,
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0,
      }
    );

    // Opzionale: prendi target dall'utente per calcolare rimanenti
    const user = await User.findById(userId).select("goals.targetCalories");
    const targetCalories = user?.goals?.targetCalories || 0;
    const remaining = targetCalories - stats.totalCalories;

    // Calcola giorni attivi (giorni con almeno un pasto)
    console.log("🔍 DEBUG getTodayMeals - userId:", userId, "tipo:", typeof userId);

    const activeDaysResult = await Meal.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
        },
      },
      { $count: "totalDays" },
    ]);

    console.log("🔍 DEBUG getTodayMeals - activeDaysResult:", JSON.stringify(activeDaysResult));

    const activeDays = activeDaysResult.length > 0 ? activeDaysResult[0].totalDays : 0;

    console.log("📊 Giorni attivi calcolati:", activeDays);

    res.status(200).json({
      success: true,
      count: todayMeals.length,
      data: todayMeals,
      dailyStats: {
        consumed: {
          calories: Math.round(stats.totalCalories),
          proteins: Math.round(stats.totalProteins),
          carbohydrates: Math.round(stats.totalCarbs),
          fats: Math.round(stats.totalFats),
        },
        // Aggiungi questi se vuoi includere target e rimanenti:
        target: targetCalories,
        remaining: remaining,
        activeDays: activeDays,
      },
    });
  } catch (error) {
    console.error("❌ Errore in getTodayMeals:", error);
    next(error);
  }
};

/**
 * GET /api/meals/analysis/date/:date
 * Ottiene i pasti per una data specifica (formato: YYYY-MM-DD)
 */
export const getMealsByDate = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { date } = req.params;

    // Validazione formato data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Formato data non valido. Usare YYYY-MM-DD",
      });
    }

    // Parsing della data
    const targetDate = new Date(date);

    // Verifica che sia una data valida
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Data non valida",
      });
    }

    // Calcola inizio e fine giornata per la data specificata
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(`🔍 getMealsByDate - Cerco pasti per ${date}:`, {
      userId,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
    });

    // Query pasti per la data specificata
    // NOTA: Include imageBase64 per visualizzare le foto nelle card
    const meals = await Meal.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ date: 1, mealType: 1 });

    // Calcola statistiche giornaliere
    const stats = meals.reduce(
      (acc, meal) => {
        acc.totalCalories += meal.totalCalories;
        acc.totalProteins += meal.totalMacros.proteins;
        acc.totalCarbs += meal.totalMacros.carbohydrates;
        acc.totalFats += meal.totalMacros.fats;
        return acc;
      },
      {
        totalCalories: 0,
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0,
      }
    );

    // Prendi target dall'utente
    const user = await User.findById(userId).select("goals.targetCalories");
    const targetCalories = user?.goals?.targetCalories || 0;
    const remaining = targetCalories - stats.totalCalories;

    console.log(`✅ Trovati ${meals.length} pasti per ${date}`);

    res.status(200).json({
      success: true,
      count: meals.length,
      date: date,
      data: meals,
      dailyStats: {
        consumed: {
          calories: Math.round(stats.totalCalories),
          proteins: Math.round(stats.totalProteins),
          carbohydrates: Math.round(stats.totalCarbs),
          fats: Math.round(stats.totalFats),
        },
        target: targetCalories,
        remaining: remaining,
      },
    });
  } catch (error) {
    console.error("❌ Errore in getMealsByDate:", error);
    next(error);
  }
};

export const getMealById = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const userId = req.userId;

    // Trova il pasto
    const meal = await Meal.findById(mealId);

    // Verifica se esiste
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Pasto non trovato"
      });
    }

    // Verifica ownership (confronto corretto con ObjectId)
    if (meal.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Non hai i permessi per visualizzare questo pasto"
      });
    }

    // Risposta successo
    res.status(200).json({
      success: true,
      data: meal
    });

  } catch (error) {
    console.error("Errore in getMealById:", error);
    next(error);
  }
};



export const deleteMealById = async (req, res, next) => {
  try {
    const { id: mealId } = req.params;
    const userId = req.userId;

    // Trova il pasto
    const meal = await Meal.findById(mealId);

    // Verifica se esiste
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Pasto non trovato"
      });
    }

    // Verifica ownership (confronto corretto con ObjectId)
    if (meal.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Non hai i permessi per visualizzare questo pasto"
      });
    }

    // Elimina il pasto
    await Meal.findByIdAndDelete(mealId);

    // Risposta successo
    res.status(200).json({
      success: true,
      message: "Pasto eliminato con successo"
    });

  } catch (error) {
    console.error("Errore in getMealById:", error);
    next(error);
  }
};