import anthropic from "../config/claude.js";

export const analyzeFoodImage = async (imageBase64, mediaType) => {
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
              text: `Analizza questa immagine di cibo e fornisci le seguenti informazioni in formato JSON:

{
  "dishName": "nome del piatto in italiano",
  "ingredients": ["lista", "degli", "ingredienti", "visibili"],
  "calories": numero_calorie_stimate,
  "macronutrients": {
    "proteins": grammi_proteine,
    "carbohydrates": grammi_carboidrati,
    "fats": grammi_grassi
  },
  "portionSize": "descrizione della porzione (es. 'porzione media 300g')",
  "confidence": "high/medium/low basato sulla chiarezza dell'immagine",
  "notes": "eventuali note aggiuntive sulla preparazione o ingredienti particolari"
}

Rispondi SOLO con il JSON, senza altro testo. Se non riesci a identificare il cibo, imposta dishName come "Non identificato" e calories a 0.`,
            },
          ],
        },
      ],
    });

    //estrai la risposta dal messaggio
    const responseMessage = message.content[0].text;

    //pulisci la risposta per ottenere solo il JSON
    let cleanResponse = responseMessage.trim();
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse.replace(/```\n?/g, "").trim();
    }

    //Parsing del Json
    let analysisResult = JSON.parse(cleanResponse);

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
