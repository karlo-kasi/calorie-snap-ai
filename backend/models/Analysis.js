import mongoose from "mongoose"

const analysisSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true,
  },
  ingredients: [{
    type: String,
  }],
  calories: {
    type: Number,
    required: true,
  },
  macronutrients: {
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
  portionSize: {
    type: String,
    default: 'standard',
  },
  confidence: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  imageBase64: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Analysis', analysisSchema);
