/**
 * Formatta i dati dell'utente per la risposta API
 * Centralizza la logica di formattazione per garantire consistenza
 *
 * @param {Object} user - Oggetto utente dal database MongoDB
 * @returns {Object} - Dati utente formattati
 */
export const formatUserData = (user) => {
  if (!user) {
    return null;
  }

  // Dati base dell'utente (sempre presenti)
  const userData = {
    id: user._id,
    email: user.email,
    name: user.username || user.profile?.name || user.email.split("@")[0],
    onboardingCompleted: user.goals?.onboardingCompleted || false,
  };

  // Aggiungi i dati del profilo solo se l'onboarding è completato
  if (user.profile && user.goals?.onboardingCompleted) {
    userData.profile = {
      name: user.profile.name,
      surname: user.profile.surname,
      age: user.profile.age,
      height: user.profile.height,
      weight: user.profile.weight,
      gender: user.profile.gender,
      activityLevel: user.profile.activityLevel,
      goal: user.goals.weeklyGoal,
      dailyCalories: user.goals.targetCalories,
    };
  }

  return userData;
};

/**
 * Mappa il genere dal formato italiano al formato del database
 *
 * @param {string} sesso - "uomo", "donna", "altro"
 * @returns {string} - "male", "female", "other"
 */
export const mapGender = (sesso) => {
  const sessoLower = sesso.toLowerCase();

  if (sessoLower === "donna") {
    return "female";
  } else if (sessoLower === "altro") {
    return "other";
  }

  return "male";
};
