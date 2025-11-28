import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";
import mealsRoutes from "./routes/mealsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";

const PORT = process.env.PORT || 3001;
const app = express();

// Abilita CORS con origini specifiche
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173']; // fallback per sviluppo

app.use(
  cors({
    origin: (origin, callback) => {
      // Permetti richieste senza origin (es: Postman, mobile apps)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true, // Permetti cookie/auth headers
  })
);

// Aumenta il limite per le immagini base64 (10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Logging richieste
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/meals", mealsRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint non trovato",
  });
});

// Error Handler
app.use(errorHandler);

// Avvia il server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Errore durante l'avvio del server:", error);
    process.exit(1);
  }
};

startServer();
