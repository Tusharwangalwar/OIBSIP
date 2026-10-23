
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const pizzaRoute = require('./routes/pizzaRoute');
const orderRoute = require("./routes/order");


app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/pizzas", require("./routes/pizza"));
app.use("/api/ingredients", require("./routes/ingredient"));
app.use('/api/pizzas', pizzaRoute);
app.use("/api/orders", orderRoute);

// Test whether our backend is working
app.get("/", (req, res) => {
  res.send("Pizza Delivery API is running!");
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas connected successfully!");

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
