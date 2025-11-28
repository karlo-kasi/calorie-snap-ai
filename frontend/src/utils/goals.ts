/**
 * Utility functions per la gestione degli obiettivi utente
 */

export type GoalType = "lose_1kg_week" | "maintain" | "gain_1kg_week" | string;

/**
 * Traduce il valore tecnico del goal in un'etichetta user-friendly
 * @param goal - Il valore del goal dal database
 * @returns L'etichetta leggibile per l'utente
 */
export const getGoalLabel = (goal: GoalType | undefined): string => {
  switch (goal) {
    case "lose_1kg_week":
      return "Perdere peso";
    case "maintain":
      return "Mantenimento";
    case "gain_1kg_week":
      return "Aumentare massa";
    default:
      return goal || "Non specificato";
  }
};

/**
 * Restituisce una descrizione più dettagliata dell'obiettivo
 * @param goal - Il valore del goal dal database
 * @returns Una descrizione dettagliata
 */
export const getGoalDescription = (goal: GoalType | undefined): string => {
  switch (goal) {
    case "lose_1kg_week":
      return "Deficit calorico per dimagrimento graduale e sostenibile";
    case "maintain":
      return "Equilibrio calorico per mantenere il peso attuale";
    case "gain_1kg_week":
      return "Surplus calorico per crescita muscolare e aumento di peso";
    default:
      return "Nessun obiettivo selezionato";
  }
};

/**
 * Restituisce un'emoji rappresentativa per l'obiettivo
 * @param goal - Il valore del goal dal database
 * @returns Un'emoji
 */
export const getGoalEmoji = (goal: GoalType | undefined): string => {
  switch (goal) {
    case "lose_1kg_week":
      return "📉";
    case "maintain":
      return "⚖️";
    case "gain_1kg_week":
      return "📈";
    default:
      return "🎯";
  }
};
