
require("dotenv").config();

const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient");

const ingredients = [
  // Five bases
  { name: "Thin Crust", category: "base", price: 50 },
  { name: "Classic Hand Tossed", category: "base", price: 60 },
  { name: "Whole Wheat", category: "base", price: 70 },
  { name: "Cheese Burst Base", category: "base", price: 90 },
  { name: "Pan Crust", category: "base", price: 65 },

  // Five sauces
  { name: "Classic Tomato", category: "sauce", price: 20 },
  { name: "Spicy Marinara", category: "sauce", price: 25 },
  { name: "Pesto", category: "sauce", price: 35 },
  { name: "Barbecue", category: "sauce", price: 30 },
  { name: "White Garlic", category: "sauce", price: 30 },

  // Cheese
  { name: "Mozzarella Cheese", category: "cheese", price: 40 },

  // Vegetables
  { name: "Onion", category: "vegetable", price: 15 },
  { name: "Capsicum", category: "vegetable", price: 15 },
  { name: "Mushroom", category: "vegetable", price: 25 },
  { name: "Sweet Corn", category: "vegetable", price: 20 },
  { name: "Olives", category: "vegetable", price: 25 },
];

async function seedIngredients() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    let inserted = 0;
    let skipped = 0;

    for (const ingredient of ingredients) {
      const result = await Ingredient.updateOne(
        {
          name: ingredient.name,
          category: ingredient.category,
        },
        {
          $setOnInsert: ingredient,
        },
        {
          upsert: true,
        }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log(`Ingredients inserted: ${inserted}`);
    console.log(`Ingredients already existed: ${skipped}`);
    console.log("Ingredient seeding completed.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedIngredients();
