import anthropic from "../config/claude.js"

/**
 * Analizza un'immagine di cibo usando Claude API
 * @param {string} imageBase64 - Immagine in formato base64
 * @param {string} mediaType - Tipo MIME dell'immagine (es. 'image/jpeg')
 * @returns {Object} Risultato dell'analisi
 */
export const analyzeFoodImage = async (imageBase64, mediaType = "image/jpeg") => {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Sei un esperto nutrizionista. Analizza questa immagine di cibo in modo DETTAGLIATO.

IMPORTANTE: Devi identificare OGNI SINGOLO INGREDIENTE visibile nel piatto, stimare la sua quantità in grammi, e calcolare calorie e macronutrienti per ciascuno.

Fornisci le informazioni in questo formato JSON:

{
  "dishName": "nome del piatto completo in italiano",
  "totalWeight": numero_peso_totale_stimato_in_grammi,
  "ingredients": [
    {
      "name": "nome ingrediente specifico",
      "quantity": numero_grammi_stimati,
      "calories": calorie_per_questa_quantità,
      "macros": {
        "proteins": grammi_proteine,
        "carbohydrates": grammi_carboidrati,
        "fats": grammi_grassi
      }
    }
  ],
  "totalCalories": somma_totale_calorie,
  "totalMacros": {
    "proteins": somma_totale_proteine,
    "carbohydrates": somma_totale_carboidrati,
    "fats": somma_totale_grassi
  },
  "confidence": "high/medium/low",
  "preparationNotes": "metodo di cottura e condimenti usati"
}

LINEE GUIDA:
- Identifica TUTTI gli ingredienti visibili separatamente (es. se vedi pasta, pomodoro, basilico, olio → 4 ingredienti separati)
- Stima con precisione il peso di ogni ingrediente (usa porzioni standard come riferimento)
- Calcola calorie e macro per la quantità SPECIFICA di ogni ingrediente
- Se vedi condimenti (olio, burro, formaggio), includili come ingredienti separati
- Sii il più preciso possibile nelle stime delle quantità
- Se ci sono più componenti nel piatto (es. proteina + contorno), analizzali separatamente

ESEMPI DI PRECISIONE:
- "100g di pasta" NON "pasta"
- "150g di petto di pollo alla griglia" NON "pollo"
- "10ml di olio extravergine" NON "condimento"
- "30g di parmigiano grattugiato" NON "formaggio"

Rispondi SOLO con il JSON valido, senza markdown o altro testo.`,
            },
          ],
        },
      ],
    });

    // Estrai il testo della risposta
    const responseText = message.content[0].text;

    // Pulisci il JSON se Claude ha aggiunto markdown
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "").trim();
    }

    // Parsing del JSON
    const analysisResult = JSON.parse(cleanedResponse);

    return {
      success: true,
      data: analysisResult,
    };
  } catch (error) {
    console.error("Errore nell'analisi con Claude:", error);

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: "Errore nel parsing della risposta di Claude",
        details: error.message,
      };
    }

    return {
      success: false,
      error: "Errore durante l'analisi dell'immagine",
      details: error.message,
    };
  }
};

export default analyzeFoodImage