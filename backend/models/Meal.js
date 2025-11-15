import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dishName: {
    type: String,
    required: true,
  },
  totalWeight: {
    type: Number,
    default: 0,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      calories: {
        type: Number,
        required: true,
      },
      macros: {
        proteins: {
          type: Number,
          default: 0,
        },
        carbohydrates: {
          type: Number,
          default: 0,
        },
        fats: {
          type: Number,
          default: 0,
        },
      },
    },
  ],
  totalCalories: {
    type: Number,
    required: true,
  },
  totalMacros: {
    proteins: {
      type: Number,
      default: 0,
    },
    carbohydrates: {
      type: Number,
      default: 0,
    },
    fats: {
      type: Number,
      default: 0,
    },
  },
  confidence: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  preparationNotes: {
    type: String,
  },
  imageBase64: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Analysis", analysisSchema);
