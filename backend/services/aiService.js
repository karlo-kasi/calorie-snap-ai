import { getActiveModels } from "../config/aiModels.js";

/**
 * Attende per un numero di millisecondi
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Prompt per l'analisi nutrizionale del cibo
 */
const FOOD_ANALYSIS_PROMPT = `Sei un esperto nutrizionista AI specializzato nell'analisi visiva di piatti e alimenti. Analizza questa immagine di cibo con la massima precisione possibile.

OBIETTIVO: Identificare ogni singolo ingrediente visibile, stimare quantità in grammi, e calcolare valori nutrizionali dettagliati.

FORMATO RISPOSTA - Restituisci SOLO un JSON valido in questo formato esatto:

{
  "dishName": "nome completo del piatto in italiano",
  "totalWeight": numero_totale_grammi_stimati,
  "ingredients": [
    {
      "name": "nome specifico ingrediente",
      "quantity": numero_grammi,
      "calories": calorie_totali_ingrediente,
      "macros": {
        "proteins": grammi_proteine,
        "carbohydrates": grammi_carboidrati,
        "fats": grammi_grassi
      }
    }
  ],
  "totalCalories": somma_calorie_totali,
  "totalMacros": {
    "proteins": somma_proteine,
    "carbohydrates": somma_carboidrati,
    "fats": somma_grassi
  },
  "confidence": "high/medium/low",
  "preparationNotes": "descrizione metodo cottura e condimenti"
}

REGOLE FONDAMENTALI:

1. SEPARAZIONE INGREDIENTI:
   - Identifica OGNI ingrediente separatamente, anche i condimenti
   - Esempio corretto: pasta (80g) + pomodoro (100g) + basilico (5g) + olio (10ml) + parmigiano (15g)
   - Esempio SBAGLIATO: "pasta al pomodoro (200g)"

2. STIMA PESO:
   - Usa riferimenti visivi (dimensioni piatto, posate, confronto oggetti)
   - Porzioni standard: pasta cotta ~80-100g, bistecca ~150-200g, verdura contorno ~150g
   - Per condimenti liquidi: cucchiaio olio ~10ml, cucchiaino burro ~5g

3. CALCOLI NUTRIZIONALI:
   - Calorie e macro DEVONO corrispondere alla quantità specifica dell'ingrediente
   - Usa valori standard per 100g, poi ricalcola proporzionalmente
   - Arrotonda a numeri interi

4. METODI DI COTTURA:
   - Specifica sempre: crudo/cotto, metodo cottura (griglia/forno/frittura/bollito)
   - Nota se ci sono aggiunte di grassi durante cottura

5. CONFIDENCE LEVEL:
   - high: ingredienti chiaramente visibili, porzioni facilmente stimabili
   - medium: alcuni ingredienti parzialmente visibili o quantità incerte
   - low: piatto complesso, ingredienti nascosti, difficile stimare porzioni

6. TOTALCALORIES e TOTALMACROS:
   - DEVE essere la somma esatta di tutti gli ingredienti
   - Verifica sempre la matematica prima di rispondere

ESEMPI DI ANALISI CORRETTA:

Piatto: Pasta al pomodoro
✓ CORRETTO:
- Pasta di semola cotta: 80g, 280kcal
- Salsa pomodoro: 100g, 30kcal
- Olio extravergine: 10ml, 90kcal
- Basilico fresco: 3g, 1kcal
- Parmigiano grattugiato: 10g, 39kcal
Total: 440kcal

✗ SBAGLIATO:
- Pasta al pomodoro: 200g, 350kcal

VALIDAZIONE FINALE:
- Verifica che la somma degli ingredienti = totali
- Controlla che tutti i numeri siano interi
- Assicurati che il JSON sia valido (no virgole finali, apici corretti)

IMPORTANTE: Rispondi ESCLUSIVAMENTE con il JSON. NO markdown, NO backticks, NO testo aggiuntivo. Solo JSON puro.`;

/**
 * Pulisce la risposta del modello rimuovendo markdown e formattazione extra
 */
const cleanJsonResponse = (responseText) => {
  let cleaned = responseText.trim();

  // Rimuovi blocchi markdown ```json ... ```
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```\n?/g, "").trim();
  }

  return cleaned;
};

/**
 * Analizza un'immagine di cibo usando AI con sistema di fallback multi-modello
 * Prova automaticamente diversi modelli AI fino a trovarne uno che funziona
 *
 * @param {string} imageBase64 - Immagine in formato base64
 * @param {string} mediaType - Tipo MIME dell'immagine (es. 'image/jpeg')
 * @param {number} retriesPerModel - Numero di tentativi per modello (default: 2)
 * @returns {Object} Risultato dell'analisi
 */
export const analyzeFoodImage = async (
  imageBase64,
  mediaType = "image/jpeg",
  retriesPerModel = 2
) => {
  const activeModels = getActiveModels();

  if (activeModels.length === 0) {
    return {
      success: false,
      error: "Nessun modello AI configurato",
      details: "Configura almeno una API key (ANTHROPIC_API_KEY o OPENAI_API_KEY) nelle variabili d'ambiente.",
    };
  }

  console.log(`\n🎯 Inizio analisi immagine con ${activeModels.length} modelli disponibili\n`);

  let allErrors = [];

  // Prova ogni modello disponibile
  for (let modelIndex = 0; modelIndex < activeModels.length; modelIndex++) {
    const model = activeModels[modelIndex];
    const modelNumber = modelIndex + 1;

    console.log(`\n📍 Modello ${modelNumber}/${activeModels.length}: ${model.name} (${model.provider})`);

    // Prova più volte con lo stesso modello
    for (let attempt = 1; attempt <= retriesPerModel; attempt++) {
      try {
        console.log(`🔍 Tentativo ${attempt}/${retriesPerModel} con ${model.name}...`);

        // Chiama il modello
        const responseText = await model.analyze(
          imageBase64,
          mediaType,
          FOOD_ANALYSIS_PROMPT
        );

        // Pulisci e parsa il JSON
        const cleanedResponse = cleanJsonResponse(responseText);
        const analysisResult = JSON.parse(cleanedResponse);

        console.log(`✅ Analisi completata con successo usando ${model.name}!\n`);

        return {
          success: true,
          data: analysisResult,
          modelUsed: model.name,
          provider: model.provider,
        };

      } catch (error) {
        const errorInfo = {
          model: model.name,
          attempt,
          error: error.message,
          status: error.status,
        };

        allErrors.push(errorInfo);

        // Determina se l'errore è temporaneo
        const isOverloaded = error.status === 529 || error.error?.error?.type === "overloaded_error";
        const isRateLimited = error.status === 429;
        const isTemporaryError = isOverloaded || isRateLimited;

        console.error(`❌ Errore tentativo ${attempt}/${retriesPerModel}:`, error.message);

        // Se è l'ultimo tentativo con questo modello
        if (attempt === retriesPerModel) {
          console.log(`⚠️ ${model.name} ha fallito tutti i ${retriesPerModel} tentativi`);

          // Se è anche l'ultimo modello disponibile
          if (modelIndex === activeModels.length - 1) {
            console.error(`\n🚫 FALLIMENTO TOTALE: Tutti i modelli hanno fallito\n`);
            break;
          }

          // Passa al prossimo modello
          console.log(`➡️ Passando al prossimo modello...\n`);
          break;
        }

        // Se l'errore è temporaneo, aspetta prima di riprovare
        if (isTemporaryError) {
          const waitTime = Math.pow(2, attempt) * 1000; // Backoff esponenziale
          console.log(`⏳ Errore temporaneo. Attendo ${waitTime / 1000}s prima di riprovare...`);
          await sleep(waitTime);
        } else {
          // Errore non recuperabile, passa al tentativo successivo o al modello successivo
          console.error(`🚫 Errore non recuperabile con questo tentativo`);
          if (attempt < retriesPerModel) {
            await sleep(1000); // Breve pausa prima del prossimo tentativo
          }
        }
      }
    }
  }

  // Se arriviamo qui, tutti i modelli hanno fallito
  console.error("\n❌ ANALISI FALLITA - Riepilogo errori:");
  allErrors.forEach((err, index) => {
    console.error(`  ${index + 1}. ${err.model} (tentativo ${err.attempt}): ${err.error}`);
  });

  // Determina il tipo di errore più comune
  const lastError = allErrors[allErrors.length - 1];

  if (lastError.status === 529) {
    return {
      success: false,
      error: "Tutti i servizi AI sono temporaneamente sovraccarichi",
      details: `Abbiamo provato ${activeModels.length} modelli diversi, ma tutti sono sovraccarichi. Riprova tra qualche minuto.`,
      modelsAttempted: activeModels.map((m) => m.name),
    };
  }

  if (lastError.status === 429) {
    return {
      success: false,
      error: "Limite di richieste superato su tutti i servizi",
      details: "Hai superato il limite di richieste. Attendi qualche minuto prima di riprovare.",
      modelsAttempted: activeModels.map((m) => m.name),
    };
  }

  if (lastError.error.includes("JSON") || lastError.error.includes("parse")) {
    return {
      success: false,
      error: "Errore nel parsing della risposta AI",
      details: "I modelli AI non hanno restituito un formato JSON valido. Riprova con un'immagine più chiara.",
      modelsAttempted: activeModels.map((m) => m.name),
    };
  }

  // Errore generico
  return {
    success: false,
    error: "Errore durante l'analisi dell'immagine",
    details: `Abbiamo provato ${activeModels.length} modelli AI ma tutti hanno fallito. Riprova più tardi.`,
    modelsAttempted: activeModels.map((m) => m.name),
    errors: allErrors,
  };
};

export default analyzeFoodImage;
