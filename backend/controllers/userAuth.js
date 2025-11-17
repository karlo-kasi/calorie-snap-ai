import User from "../models/User.js";
import { generateToken } from "../services/tokenService.js";
import { hashPassword, comparePassword } from "../services/passwordService.js";

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

    res.status(201).json({
      message: "Registrazione avvenuta con successo",
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.username,
        onboardingCompleted: false,
      },
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

    // Prepara i dati utente da restituire
    const userData = {
      id: user._id,
      email: user.email,
      name: user.username || user.profile?.name || user.email.split("@")[0],
      onboardingCompleted: user.goals?.onboardingCompleted || false,
    };

    console.log("📤 DEBUG LOGIN - userData da inviare:", userData);

    // Aggiungi i dati del profilo se esistono
    if (user.profile && user.goals?.onboardingCompleted) {
      userData.profile = {
        name: user.profile.name,
        surname: user.profile.surname,
        age: user.profile.age,
        height: user.profile.height,
        weight: user.profile.weight,
        gender: user.profile.gender,
        activityLevel: user.profile.activityLevel,
        goal: user.goals.weeklyGoal,
        dailyCalories: user.goals.targetCalories,
      };
      console.log("✅ DEBUG LOGIN - Profile aggiunto:", userData.profile);
    } else {
      console.log("⚠️ DEBUG LOGIN - Profile NON aggiunto:", {
        hasProfile: !!user.profile,
        onboardingCompleted: user.goals?.onboardingCompleted,
      });
    }

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
