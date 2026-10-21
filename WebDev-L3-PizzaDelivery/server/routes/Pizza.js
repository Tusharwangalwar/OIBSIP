
const express = require("express");
const Pizza = require("../models/Pizza");

const router = express.Router();

// Get all available pizzas
router.get("/", async (req, res) => {
  try {
    const pizzas = await Pizza.find({ available: true })
      .select("-__v")
      .sort({ name: 1 });

    res.json({
      count: pizzas.length,
      pizzas,
    });
  } catch (error) {
    console.error("Pizza menu error:", error.message);
    res.status(500).json({
      message: "Unable to load the pizza menu.",
    });
  }
});

// Get one pizza by its ID
router.get("/:id", async (req, res) => {
  try {
    if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
      return res.status(400).json({
        message: "Invalid pizza ID.",
      });
    }

    const pizza = await Pizza.findOne({
      _id: req.params.id,
      available: true,
    }).select("-__v");

    if (!pizza) {
      return res.status(404).json({
        message: "Pizza not found.",
      });
    }

    res.json({ pizza });
  } catch (error) {
    console.error("Pizza lookup error:", error.message);
    res.status(500).json({
      message: "Unable to retrieve pizza.",
    });
  }
});

module.exports = router;
