import { fileToBase64 } from "./fileToBase64";

const API_URL = import.meta.env.VITE_API_URL;

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data: {
    dishName: string;
    ingredients: string[];
    calories: number;
    macronutrients: {
      proteins: number;
      carbohydrates: number;
      fats: number;
    };
    portionSize: string;
    confidence: string;
    notes: string;
    imageBase64: string;
    _id: string;
    createdAt: string;
  };
}
export const analysisService = {
  async analyzeImageFile(file: File): Promise<AnalysisResponse> {

    // Converti in base 64
    const base64Image = await fileToBase64(file);
    // Determina il tipo MIME
    const mediaType = file.type || "image/jpeg";

    console.log("📤 Invio foto al backend...");
    console.log("   - Tipo:", mediaType);
    console.log("   - Dimensione base64:", base64Image.length);

    // Chiamata POST al backend
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: base64Image,
        mediaType: mediaType,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Errore durante l'analisi");
    }

    console.log("✅ Analisi completata:", data);

    return data;
  },
};
