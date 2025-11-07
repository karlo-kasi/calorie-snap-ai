import "dotenv/config";

console.log("🔍 Backend Configuration Check\n");

// 1. Check Environment Variables
console.log("1️⃣  Environment Variables:");
console.log("   ✓ PORT:", process.env.PORT || "3001 (default)");
console.log("   ✓ NODE_ENV:", process.env.NODE_ENV || "not set");
console.log("   ✓ MONGODB_URI:", process.env.MONGODB_URI ? "✓ Set" : "❌ Missing");
console.log("   ✓ CLAUDE_API_KEY:", process.env.CLAUDE_API_KEY ? "✓ Set" : "❌ Missing");
console.log("   ✓ CORS_ORIGINS:", process.env.CORS_ORIGINS || "not set");

// 2. Check MongoDB Connection
console.log("\n2️⃣  Testing MongoDB Connection...");
try {
  const mongoose = await import("mongoose");

  await mongoose.default.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log("   ✅ MongoDB Connected Successfully!");
  console.log("   Database:", mongoose.default.connection.name);

  await mongoose.default.connection.close();
} catch (error) {
  console.log("   ❌ MongoDB Connection Failed:", error.message);
}

// 3. Check if models can be loaded
console.log("\n3️⃣  Testing Model Loading...");
try {
  const { default: Analysis } = await import("./models/Analysis.js");
  console.log("   ✅ Analysis model loaded successfully");
  console.log("   Model name:", Analysis.modelName);
} catch (error) {
  console.log("   ❌ Model loading failed:", error.message);
}

// 4. Check if services can be loaded
console.log("\n4️⃣  Testing Service Loading...");
try {
  const { analyzeFoodImage } = await import("./services/claudeService.js");
  console.log("   ✅ Claude service loaded successfully");
  console.log("   Function type:", typeof analyzeFoodImage);
} catch (error) {
  console.log("   ❌ Service loading failed:", error.message);
}

// 5. Check if controllers can be loaded
console.log("\n5️⃣  Testing Controller Loading...");
try {
  const controllers = await import("./controllers/userController.js");
  const controllerNames = Object.keys(controllers);
  console.log("   ✅ Controllers loaded successfully");
  console.log("   Available controllers:", controllerNames.join(", "));
} catch (error) {
  console.log("   ❌ Controller loading failed:", error.message);
}

// 6. Check if routes can be loaded
console.log("\n6️⃣  Testing Routes Loading...");
try {
  const { default: routes } = await import("./routes/routes.js");
  console.log("   ✅ Routes loaded successfully");
} catch (error) {
  console.log("   ❌ Routes loading failed:", error.message);
}

// 7. Check Anthropic SDK
console.log("\n7️⃣  Testing Anthropic SDK...");
try {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  console.log("   ✅ Anthropic SDK loaded successfully");
  console.log("   SDK version:", Anthropic.VERSION || "unknown");

  if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== "your_anthropic_api_key_here") {
    const client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
    console.log("   ✅ Anthropic client initialized");
  } else {
    console.log("   ⚠️  API key not configured - cannot test API connection");
  }
} catch (error) {
  console.log("   ❌ Anthropic SDK test failed:", error.message);
}

console.log("\n✅ Backend configuration check completed!\n");

// Summary
console.log("📋 Summary:");
const mongoOk = process.env.MONGODB_URI ? "✓" : "✗";
const claudeOk = process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== "your_anthropic_api_key_here" ? "✓" : "✗";

console.log(`   [${mongoOk}] MongoDB URI configured`);
console.log(`   [${claudeOk}] Claude API Key configured`);
console.log("\n💡 Next steps:");
if (!process.env.CLAUDE_API_KEY || process.env.CLAUDE_API_KEY === "your_anthropic_api_key_here") {
  console.log("   1. Set CLAUDE_API_KEY in .env file");
}
console.log("   2. Run: npm start");
console.log("   3. Test endpoints with curl or Postman\n");

process.exit(0);
