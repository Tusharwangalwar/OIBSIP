const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["base", "sauce", "cheese", "vegetable"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ingredientSchema.index(
  { name: 1, category: 1 },
  { unique: true }
);

module.exports = mongoose.model("Ingredient", ingredientSchema);
