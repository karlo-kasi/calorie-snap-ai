// Configurazioni macro per goal (g per kg di peso corporeo)
const GOAL_PROTEIN_RULES = {
  lose_1kg_week: { defaultGkg: 2.1 },
  maintain: { defaultGkg: 1.6 },
  gain_1kg_week: { defaultGkg: 1.7 },
};

const GOAL_FAT_RULES = {
  lose_1kg_week: { defaultGkg: 0.7 },
  maintain: { defaultGkg: 0.9 },
  gain_1kg_week: { defaultGkg: 1.0 },
};

const ACTIVITY_CARB_FLOORS = {
  sedentary: { defaultMinGkg: 2.0 },
  light: { defaultMinGkg: 2.5 },
  moderate: { defaultMinGkg: 3.0 },
  active: { defaultMinGkg: 3.5 },
  very_active: { defaultMinGkg: 4.0 },
};

const macroCalculator = (weight, calories, goal, activityLevel) => {
  const proteins = weight * GOAL_PROTEIN_RULES[goal].defaultGkg;
  const fats = weight * GOAL_FAT_RULES[goal].defaultGkg;

  const kcal_protein = proteins * 4;
  const kcal_fat = fats * 9;

  const kcal_carbo = calories - kcal_protein - kcal_fat;
  const carbos = kcal_carbo / 4;

  const minCarbs = weight * ACTIVITY_CARB_FLOORS[activityLevel].defaultMinGkg;

  if (carbos < minCarbs) {
    // Caso CUT: riduci grassi, aumenta carbo
    const deficit_kcal = (minCarbs - carbos) * 4;
    const new_kcal_fat = kcal_fat - deficit_kcal;
    const new_fats = new_kcal_fat / 9;

    const minFatsAbsolute = weight * 0.6;

    if (new_fats < minFatsAbsolute) {
      throw new Error(
        `Impossibile raggiungere ${minCarbs}g di carboidrati mantenendo grassi sicuri (min ${Math.round(
          minFatsAbsolute
        )}g).`
      );
    }

    const new_kcal_carbo = calories - kcal_protein - new_kcal_fat;
    const new_carbos = new_kcal_carbo / 4;

    return {
      proteins: Math.round(proteins),
      carbos: Math.round(new_carbos),
      fats: Math.round(new_fats),
    };
  }

  // OPZIONALE: Limita carbo eccessivi in bulk (comfort digestivo)
  const maxCarbs = weight * 6.0; // 6 g/kg = limite comfort

  if (carbos > maxCarbs) {
    // Caso BULK: troppi carbo, sposta verso grassi
    const excess_kcal = (carbos - maxCarbs) * 4;
    const new_kcal_fat = kcal_fat + excess_kcal;
    const new_fats = new_kcal_fat / 9;

    return {
      proteins: Math.round(proteins),
      carbos: Math.round(maxCarbs),
      fats: Math.round(new_fats),
    };
  }

  // Caso normale: tutto OK
  return {
    proteins: Math.round(proteins),
    carbos: Math.round(carbos),
    fats: Math.round(fats),
  };
};

export { macroCalculator };
