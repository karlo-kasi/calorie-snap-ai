import User from "../models/User.js";
import { formatUserData, mapGender } from "../utils/userFormatter.js";
import { caloriesCalculator } from "../services/caloriesCalculator.js";

export const setupProfile = async (req, res) => {
  try {
    console.log("📥 Dati ricevuti dal frontend:", req.body);
    console.log("👤 UserId dal middleware:", req.userId);

    const { nome, cognome, età, altezza, peso, sesso, attività, goal } =
      req.body;

    // Validazione dati
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
      return res.status(400).json({
        success: false,
        message: "Dati mancanti!",
      });
    }

    const userId = req.userId;

    if (!userId) {
      console.log("❌ UserId mancante!");
      return res.status(401).json({
        success: false,
        message: "Utente non autenticato",
      });
    }

    // Calcola le calorie
    console.log("🧮 Calcolo calorie con parametri:", {
      età,
      altezza,
      peso,
      sesso,
      attività,
      goal,
    });
    const objectCalories = caloriesCalculator(
      età,
      altezza,
      peso,
      sesso,
      attività,
      goal
    );
    console.log("✅ Calorie calcolate:", objectCalories);

    // Mappa il gender usando la funzione helper
    const gender = mapGender(sesso);

    // Aggiorna l'utente nel database
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
        "goals.macroTargets.proteins": objectCalories.macros.proteins,
        "goals.macroTargets.carbs": objectCalories.macros.carbos,
        "goals.macroTargets.fats": objectCalories.macros.fats,
        "goals.onboardingCompleted": true,
      },
      { new: true, runValidators: true }
    );

    console.log("✅ Utente aggiornato:", user ? "Success" : "Not found");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utente non trovato",
      });
    }

    // Usa la funzione helper per formattare i dati utente
    const userData = formatUserData(user);

    res.status(200).json({
      success: true,
      message: "Profilo aggiornato con successo",
      user: userData,
      calories: objectCalories,
    });
  } catch (err) {
    console.error("❌ Errore in setupInformation:", err);
    console.error("Stack trace:", err.stack);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};