const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pizza = require('./models/pizzaModel');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding...'))
    .catch((err) => {
        console.log('DB Connection Failed:', err);
        process.exit(1);
    });

// Sample Pizza Data
const pizzas = [
    {
        name: "Margherita",
        variants: ["small", "medium", "large"],
        prices: [
            {
                small: 199,
                medium: 399,
                large: 599
            }
        ],
        category: "veg",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
        description: "Classic delight with 100% real mozzarella cheese"
    },
    {
        name: "Farmhouse",
        variants: ["small", "medium", "large"],
        prices: [
            {
                small: 229,
                medium: 439,
                large: 649
            }
        ],
        category: "veg",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        description: "Delightful combination of onion, capsicum, tomato & grilled mushroom"
    },
    {
        name: "Chicken Dominator",
        variants: ["small", "medium", "large"],
        prices: [
            {
                small: 309,
                medium: 579,
                large: 849
            }
        ],
        category: "nonveg",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
        description: "Meaty overload of pepper barbecue chicken, peri-peri chicken, and chicken tikka"
    }
];

// Function to import data
const importData = async () => {
    try {
        // Clear existing pizzas to avoid duplicate entries
        await Pizza.deleteMany();
        
        // Insert sample pizzas
        await Pizza.insertMany(pizzas);
        
        console.log('Sample Pizzas Imported Successfully! 🍕');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
};

importData();