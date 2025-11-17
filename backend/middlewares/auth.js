import { verifyToken } from "../services/tokenService.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token Mancante" });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("❌ Errore autenticazione:", error);
    return res.status(401).json({ error: "Token non valido" });
  }
};

export default authMiddleware
