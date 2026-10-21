const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    variants: [], // e.g., ["small", "medium", "large"]
    prices: [],   // e.g., [{ small: 199, medium: 399, large: 599 }]
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('pizzas', pizzaSchema);