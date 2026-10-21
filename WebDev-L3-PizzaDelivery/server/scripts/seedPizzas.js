
require("dotenv").config();

const mongoose = require("mongoose");
const Pizza = require("../models/Pizza");

const samplePizzas = [
  {
    name: "Margherita",
    description: "Classic pizza with cheese and tomato.",
    basePrice: 199,
    available: true,
  },
  {
    name: "Farmhouse",
    description: "Loaded with onion, capsicum, and vegetables.",
    basePrice: 279,
    available: true,
  },
  {
    name: "Paneer Tikka",
    description: "Spiced paneer with a delicious tikka flavor.",
    basePrice: 299,
    available: true,
  },
  {
    name: "Veggie Delight",
    description: "A colorful mix of fresh vegetables and cheese.",
    basePrice: 249,
    available: true,
  },
  {
    name: "Cheese Burst",
    description: "A cheesy pizza for cheese lovers.",
    basePrice: 329,
    available: true,
  },
];

async function seedPizzas() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas.");

    let inserted = 0;
    let skipped = 0;

    for (const pizza of samplePizzas) {
      const result = await Pizza.updateOne(
        { name: pizza.name },
        { $setOnInsert: pizza },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log(`Inserted: ${inserted}`);
    console.log(`Already existed: ${skipped}`);
    console.log("Pizza seeding completed.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedPizzas();
