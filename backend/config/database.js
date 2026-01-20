import mongoose from "mongoose";

const connectDB = async () => {
  try {

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI non configurata! Controlla le variabili su Railway.");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
