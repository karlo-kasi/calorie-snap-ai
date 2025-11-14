import { verifyToken } from "../services/tokenService";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.spli(" ")[1];

    if (!token) {
      res.status(401).json({ messagge: "Token Mancante" });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token non valido" });
  }
};

export default authMiddleware
