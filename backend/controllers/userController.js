import Analysis from "../models/Analysis.js";
import {analyzeFoodImage} from "../services/claudeService.js";

/**
 * Controller per caricare un'immagine e analizzarla con Claude AI
 * POST /api/analysis/upload
 */
export const uploadAndAnalyze = async (req, res, next) => {
  try {
    const { imageBase64, mediaType } = req.body;

    // Validazione input
    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "Immagine mancante. Fornire imageBase64 nel body della richiesta.",
      });
    }

    if (!mediaType) {
      return res.status(400).json({
        success: false,
        message: "Tipo media mancante. Fornire mediaType (es. 'image/jpeg').",
      });
    }

    // Validazione formato media type
    const validMediaTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validMediaTypes.includes(mediaType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Formato immagine non supportato. Formati validi: ${validMediaTypes.join(", ")}`,
      });
    }
    

    // Chiama il servizio Claude per analizzare l'immagine
    console.log("🔍 Inizio analisi immagine con Claude AI...");
    const analysisResult = await analyzeFoodImage(imageBase64, mediaType);

    // Verifica se l'analisi è riuscita
    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        message: analysisResult.error || "Errore durante l'analisi dell'immagine",
        details: process.env.NODE_ENV === "development" ? analysisResult.details : undefined,
      });
    }

    // Estrai i dati dall'analisi
    const {
      dishName,
      ingredients,
      calories,
      macronutrients,
      portionSize,
      confidence,
      notes,
    } = analysisResult.data;

    // Crea un nuovo documento Analysis
    const newAnalysis = new Analysis({
      dishName,
      ingredients,
      calories,
      macronutrients,
      portionSize,
      confidence,
      notes,
      imageBase64, // Salva l'immagine per riferimento futuro
    });

    // Salva nel database
    const savedAnalysis = await newAnalysis.save();

    console.log(`✅ Analisi salvata con successo: ${savedAnalysis._id}`);

    // Risposta di successo
    res.status(201).json({
      success: true,
      message: "Immagine analizzata e salvata con successo",
      data: savedAnalysis,
    });
  } catch (error) {
    console.error("❌ Errore in uploadAndAnalyze:", error);
    next(error);
  }
};

/**
 * Controller per ottenere lo storico delle analisi
 * GET /api/analysis/history
 * Query params: limit, skip, sortBy
 */
export const getAnalysisHistory = async (req, res, next) => {
  try {
    const {
      limit = 20,
      skip = 0,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Converti limit e skip in numeri
    const limitNum = parseInt(limit, 10);
    const skipNum = parseInt(skip, 10);

    // Validazione
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Il parametro 'limit' deve essere un numero tra 1 e 100",
      });
    }

    if (isNaN(skipNum) || skipNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Il parametro 'skip' deve essere un numero >= 0",
      });
    }

    // Definisci l'ordinamento
    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    // Query al database
    const analyses = await Analysis.find()
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skipNum)
      .select("-imageBase64"); // Escludi le immagini base64 per ridurre il payload

    // Conta totale dei documenti
    const total = await Analysis.countDocuments();

    res.status(200).json({
      success: true,
      count: analyses.length,
      total,
      data: analyses,
    });
  } catch (error) {
    console.error("❌ Errore in getAnalysisHistory:", error);
    next(error);
  }
};

/**
 * Controller per ottenere una singola analisi tramite ID
 * GET /api/analysis/:id
 */
export const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validazione ID
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID non valido. Fornire un ObjectId MongoDB valido.",
      });
    }

    // Query al database
    const analysis = await Analysis.findById(id);

    // Verifica se l'analisi esiste
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analisi non trovata",
      });
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("❌ Errore in getAnalysisById:", error);
    next(error);
  }
};

/**
 * Controller per eliminare un'analisi
 * DELETE /api/analysis/:id
 */
export const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validazione ID
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID non valido. Fornire un ObjectId MongoDB valido.",
      });
    }

    // Elimina dal database
    const deletedAnalysis = await Analysis.findByIdAndDelete(id);

    // Verifica se l'analisi esisteva
    if (!deletedAnalysis) {
      return res.status(404).json({
        success: false,
        message: "Analisi non trovata",
      });
    }

    console.log(`🗑️  Analisi eliminata: ${id}`);

    res.status(200).json({
      success: true,
      message: "Analisi eliminata con successo",
      data: deletedAnalysis,
    });
  } catch (error) {
    console.error("❌ Errore in deleteAnalysis:", error);
    next(error);
  }
};

/**
 * Controller per ottenere statistiche sulle analisi
 * GET /api/analysis/stats
 */
export const getAnalysisStats = async (req, res, next) => {
  try {
    // Calcola statistiche
    const total = await Analysis.countDocuments();

    // Media calorie
    const avgCaloriesResult = await Analysis.aggregate([
      {
        $group: {
          _id: null,
          avgCalories: { $avg: "$calories" },
          totalCalories: { $sum: "$calories" },
          avgProteins: { $avg: "$macronutrients.proteins" },
          avgCarbs: { $avg: "$macronutrients.carbohydrates" },
          avgFats: { $avg: "$macronutrients.fats" },
        },
      },
    ]);

    // Conteggio per livello di confidenza
    const confidenceStats = await Analysis.aggregate([
      {
        $group: {
          _id: "$confidence",
          count: { $sum: 1 },
        },
      },
    ]);

    // Piatti più frequenti (top 10)
    const topDishes = await Analysis.aggregate([
      {
        $group: {
          _id: "$dishName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const stats = {
      total,
      averages: avgCaloriesResult[0] || {
        avgCalories: 0,
        totalCalories: 0,
        avgProteins: 0,
        avgCarbs: 0,
        avgFats: 0,
      },
      confidenceDistribution: confidenceStats,
      topDishes,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Errore in getAnalysisStats:", error);
    next(error);
  }
};
