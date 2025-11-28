import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Debug: mostra tutte le variabili d'ambiente disponibili
    console.log("🔍 Variabili d'ambiente disponibili:");
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Presente" : "❌ Mancante");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("PORT:", process.env.PORT);

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI non configurata! Controlla le variabili su Railway.");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
