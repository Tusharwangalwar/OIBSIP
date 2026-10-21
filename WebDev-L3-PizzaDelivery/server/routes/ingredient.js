
const express = require("express");
const Ingredient = require("../models/Ingredient");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({
      available: true,
    })
      .select("name category price")
      .sort({ category: 1, name: 1 })
      .lean();

    const grouped = {
      bases: ingredients.filter((i) => i.category === "base"),
      sauces: ingredients.filter((i) => i.category === "sauce"),
      cheese: ingredients.filter((i) => i.category === "cheese"),
      vegetables: ingredients.filter(
        (i) => i.category === "vegetable"
      ),
    };

    res.json(grouped);
  } catch (error) {
    console.error("Ingredient API error:", error.message);
    res.status(500).json({
      message: "Unable to load ingredients.",
    });
  }
});

module.exports = router;
