import User from "../models/Users.js";
import { generateToken } from "../services/tokenService.js";
import { hashPassword, comparePassword } from "../services/passwordService.js";

const newUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      passwordHash: await hashPassword(password),
    });

    const token = generateToken(newUser.id);

    res.status(201).json({
      message: "Registrazione avvenuta con successo",
      token,
      userId: newUser._id,
      email: newUser.email,
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

    const comparazione = await comparePassword(password, user.passwordHash);

    if (!comparazione) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: "Login avvenuto con successo!",
      token,
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { newUser, loginUser };
