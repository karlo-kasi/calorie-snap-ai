import anthropic from "../config/claude.js";

/**
 * Attende per un numero di millisecondi
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analizza un'immagine di cibo usando Claude API con retry automatico
 * @param {string} imageBase64 - Immagine in formato base64
 * @param {string} mediaType - Tipo MIME dell'immagine (es. 'image/jpeg')
 * @param {number} maxRetries - Numero massimo di tentativi (default: 3)
 * @returns {Object} Risultato dell'analisi
 */
export const analyzeFoodImage = async (
  imageBase64,
  mediaType = "image/jpeg",
  maxRetries = 3
) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `🔍 Tentativo ${attempt}/${maxRetries} - Analisi immagine con Claude AI...`
      );

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
              text: `Sei un esperto nutrizionista AI specializzato nell'analisi visiva di piatti e alimenti. Analizza questa immagine di cibo con la massima precisione possibile.

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

IMPORTANTE: Rispondi ESCLUSIVAMENTE con il JSON. NO markdown, NO backticks, NO testo aggiuntivo. Solo JSON puro.`,
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

      console.log(`✅ Analisi completata con successo (tentativo ${attempt})`);

      return {
        success: true,
        data: analysisResult,
      };
    } catch (error) {
      lastError = error;

      // Gestione errori specifici
      const isOverloaded = error.status === 529 || error.error?.error?.type === "overloaded_error";
      const isRateLimited = error.status === 429;
      const shouldRetry = isOverloaded || isRateLimited;

      console.error(`❌ Errore tentativo ${attempt}/${maxRetries}:`, error.message);

      // Se è l'ultimo tentativo, non ritentare
      if (attempt === maxRetries) {
        console.error("🚫 Raggiunto numero massimo di tentativi");
        break;
      }

      // Ritenta solo per errori temporanei (529, 429)
      if (shouldRetry) {
        // Backoff esponenziale: 2s, 4s, 8s
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Attendo ${waitTime / 1000}s prima di riprovare...`);
        await sleep(waitTime);
        continue;
      }

      // Per altri errori, non ritentare
      console.error("🚫 Errore non recuperabile:", error.message);
      break;
    }
  }

  // Se arriviamo qui, tutti i tentativi sono falliti
  console.error("❌ Tutti i tentativi falliti");

  // Gestione errori finali
  if (lastError instanceof SyntaxError) {
    return {
      success: false,
      error: "Errore nel parsing della risposta di Claude",
      details: lastError.message,
    };
  }

  // Errore API Claude
  if (lastError?.status === 529) {
    return {
      success: false,
      error: "Il servizio Claude AI è temporaneamente sovraccarico",
      details: "Riprova tra qualche minuto. L'API di Anthropic è attualmente sovraccarica.",
    };
  }

  if (lastError?.status === 429) {
    return {
      success: false,
      error: "Troppe richieste all'API Claude",
      details: "Hai superato il limite di richieste. Attendi qualche minuto.",
    };
  }

  // Errore generico
  return {
    success: false,
    error: "Errore durante l'analisi dell'immagine",
    details: lastError?.message || "Errore sconosciuto",
  };
};

export default analyzeFoodImage;
