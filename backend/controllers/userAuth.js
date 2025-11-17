import User from "../models/User.js";
import { generateToken } from "../services/tokenService.js";
import { hashPassword, comparePassword } from "../services/passwordService.js";
import { formatUserData } from "../utils/userFormatter.js";

const newUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "Email o Password mancanti" });
    }

    const emailRegistrata = await User.findOne({ email: email });

    if (emailRegistrata) {
      return res
        .status(401)
        .json({ message: "Utente già registrato con questa email" });
    }

    const newUser = await User.create({
      email: email,
      username: name || email.split("@")[0],
      passwordHash: await hashPassword(password),
    });

    const token = generateToken(newUser.id);

    // Usa la funzione helper per formattare i dati utente
    const userData = formatUserData(newUser);

    res.status(201).json({
      message: "Registrazione avvenuta con successo",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "Email o Password mancante" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    console.log("🔍 DEBUG LOGIN - User dal DB:", {
      id: user._id,
      email: user.email,
      username: user.username,
      hasProfile: !!user.profile,
      profile: user.profile,
      hasGoals: !!user.goals,
      goals: user.goals,
      onboardingCompleted: user.goals?.onboardingCompleted,
    });

    const comparazione = await comparePassword(password, user.passwordHash);

    if (!comparazione) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const token = generateToken(user.id);

    // Usa la funzione helper per formattare i dati utente
    const userData = formatUserData(user);

    console.log("📤 DEBUG LOGIN - userData da inviare:", userData);

    res.status(200).json({
      message: "Login avvenuto con successo!",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { newUser, loginUser };
