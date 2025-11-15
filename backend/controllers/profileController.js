import { caloriesCalculator } from "../services/caloriesCalculator.js";
import User from "../models/User.js";

const setupInformation = async (req, res) => {
  try {
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
      return res.status(401).json({ message: "Dati mancanti!" });
    }
    const userId = req.userId || "69175baa6733311dccb884e2";

    // Calcola le calorie
    const objectCalories = caloriesCalculator(
      età,
      altezza,
      peso,
      sesso,
      attività,
      goal
    );

    // Update con campi nested
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username: `${nome} ${cognome}`, // Opzionale
        "profile.name": nome,
        "profile.surname": cognome,
        "profile.age": età,
        "profile.gender": sesso.toLowerCase() === "donna" ? "female" : "male",
        "profile.weight": peso,
        "profile.height": altezza,
        "profile.activityLevel": attività,
        "goals.targetCalories": objectCalories.TARGET,
        "goals.weeklyGoal": goal,
        "goals.onboardingCompleted": true,
      },
      { new: true, runValidators: true }
    );

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
    res.status(500).json({ error: err.message });
  }
};

export default setupInformation;
