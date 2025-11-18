import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },

    // Dati profilo per calcolo calorie
    profile: {
      name: String,
      surname: String,
      age: Number,
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      weight: Number, // kg
      height: Number, // cm
      activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "very_active"],
      },
    },

    // Obiettivi
    goals: {
      targetWeight: Number,
      targetCalories: Number,
      weeklyGoal: {
        type: String,
        enum: [
          "lose_1kg_week",
          "lose_0_5kg_week",
          "maintain",
          "gain_0_5kg_week",
          "gain_1kg_week",
        ],
      },
      macroTargets: {
        proteins: {
          type: Number,
          default: 0,
        },
        carbs: {
          type: Number,
          default: 0,
        },
        fats: {
          type: Number,
          default: 0,
        },
      },
      onboardingCompleted: {
        type: Boolean,
        default: false,
      },
    },

    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800,
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Aggiunge createdAt e updatedAt automaticamente
  }
);

export default mongoose.model("User", userSchema);
