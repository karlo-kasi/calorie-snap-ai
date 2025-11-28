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

// Parse CORS origins da variabile d'ambiente
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : []
  )
];

// Log per debug
console.log('🌐 CORS Origins consentiti:', allowedOrigins);

// Abilita CORS con gestione dinamica degli origins
app.use(cors({
  origin: (origin, callback) => {
    // Permetti richieste senza origin (Postman, curl, app mobile)
    if (!origin) {
      console.log('✅ CORS: Richiesta senza origin (consentita)');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin consentito:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin bloccato:', origin);
      console.log('   Origins consentiti:', allowedOrigins);
      callback(new Error(`CORS: Origin ${origin} non autorizzato`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
