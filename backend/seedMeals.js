import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Meal from './models/Meal.js';

dotenv.config();

const testMeals = [
  {
    userId: "69175baa6733311dccb884e2",
    mealType: "breakfast",
    date: new Date(),
    dishName: "Colazione completa",
    totalWeight: 250,
    ingredients: [
      {
        name: "Latte",
        quantity: 200,
        calories: 120,
        macros: { proteins: 6, carbohydrates: 10, fats: 6 }
      },
      {
        name: "Biscotti",
        quantity: 50,
        calories: 230,
        macros: { proteins: 3, carbohydrates: 35, fats: 9 }
      }
    ],
    totalCalories: 350,
    totalMacros: { proteins: 9, carbohydrates: 45, fats: 15 },
    confidence: "high",
    preparationNotes: "Colazione italiana classica"
  },
  {
    userId: "69175baa6733311dccb884e2",
    mealType: "lunch",
    date: new Date(),
    dishName: "Pasta al pomodoro con parmigiano",
    totalWeight: 350,
    ingredients: [
      {
        name: "Pasta",
        quantity: 100,
        calories: 350,
        macros: { proteins: 12, carbohydrates: 70, fats: 2 }
      },
      {
        name: "Pomodoro",
        quantity: 150,
        calories: 30,
        macros: { proteins: 1.5, carbohydrates: 6, fats: 0.3 }
      },
      {
        name: "Parmigiano",
        quantity: 30,
        calories: 120,
        macros: { proteins: 10, carbohydrates: 1, fats: 9 }
      },
      {
        name: "Olio d'oliva",
        quantity: 10,
        calories: 90,
        macros: { proteins: 0, carbohydrates: 0, fats: 10 }
      }
    ],
    totalCalories: 590,
    totalMacros: { proteins: 23.5, carbohydrates: 77, fats: 21.3 },
    confidence: "high",
    preparationNotes: "Pasta cotta al dente con sugo di pomodoro fresco e parmigiano grattugiato"
  },
  {
    userId: "69175baa6733311dccb884e2",
    mealType: "snack",
    date: new Date(),
    dishName: "Frutta fresca",
    totalWeight: 150,
    ingredients: [
      {
        name: "Mela",
        quantity: 150,
        calories: 80,
        macros: { proteins: 0.4, carbohydrates: 21, fats: 0.3 }
      }
    ],
    totalCalories: 80,
    totalMacros: { proteins: 0.4, carbohydrates: 21, fats: 0.3 },
    confidence: "high",
    preparationNotes: "Mela rossa fresca"
  },
  {
    userId: "69175baa6733311dccb884e2",
    mealType: "dinner",
    date: new Date(),
    dishName: "Pollo alla griglia con insalata",
    totalWeight: 400,
    ingredients: [
      {
        name: "Petto di pollo",
        quantity: 200,
        calories: 240,
        macros: { proteins: 48, carbohydrates: 0, fats: 4 }
      },
      {
        name: "Insalata mista",
        quantity: 150,
        calories: 20,
        macros: { proteins: 1, carbohydrates: 4, fats: 0.2 }
      },
      {
        name: "Olio d'oliva",
        quantity: 10,
        calories: 90,
        macros: { proteins: 0, carbohydrates: 0, fats: 10 }
      }
    ],
    totalCalories: 350,
    totalMacros: { proteins: 49, carbohydrates: 4, fats: 14.2 },
    confidence: "high",
    preparationNotes: "Pollo grigliato con verdure fresche"
  }
];

const seedMeals = async () => {
  try {
    console.log('🔄 Connessione a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    console.log('🗑️  Rimozione pasti esistenti...');
    const deleted = await Meal.deleteMany({ userId: "69175baa6733311dccb884e2" });
    console.log(`✅ ${deleted.deletedCount} pasti rimossi`);
    
    console.log('📝 Inserimento nuovi pasti...');
    const meals = await Meal.insertMany(testMeals);
    console.log(`✅ ${meals.length} pasti inseriti con successo!`);
    
    console.log('\n📊 Pasti creati:');
    meals.forEach(meal => {
      console.log(`  - ${meal.mealType}: ${meal.dishName} (${meal.totalCalories} kcal)`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Database chiuso correttamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedMeals();
