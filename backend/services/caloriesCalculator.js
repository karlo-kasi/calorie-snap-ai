import { macroCalculator } from "./macroCalculator.js";

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const DAILY_GOAL_ADJUSTMENTS = {
  lose_1kg_week: -1000,
  lose_0_5kg_week: -500,
  maintain: 0,
  gain_0_5kg_week: 500,
  gain_1kg_week: 1000,
};

const caloriesCalculator = (eta, altezza, peso, sesso, attività, goal) => {
  let BMR = 0;

  if (sesso.toLowerCase() === "donna") {
    BMR = 10 * peso + 6.25 * altezza - 5 * eta - 161;
  } else {
    BMR = 10 * peso + 6.25 * altezza - 5 * eta + 5;
  }

  const TDEE = BMR * ACTIVITY_MULTIPLIERS[attività];

  const TARGET = TDEE + DAILY_GOAL_ADJUSTMENTS[goal];

  const macros = macroCalculator(peso, Math.round(TARGET), goal, attività);

  return {
    BMR: Math.round(BMR),
    TDEE: Math.round(TDEE),
    TARGET: Math.round(TARGET),
    deficit: DAILY_GOAL_ADJUSTMENTS[goal],
    macros: macros,
  };
};

export { caloriesCalculator };
