import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/database.js";
import errorHandler from "./middlewares/errorHandler.js";
import allRoutes from "./routes/routes.js";

const PORT = process.env.PORT || 3001;
const app = express();

// Abilita Cors
app.use(
  cors({
    origin: "*",
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

// Usa le rotte definite in routes.js
app.use("/api", allRoutes);

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
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Errore durante l'avvio del server:", error);
    process.exit(1);
  }
};

startServer();
