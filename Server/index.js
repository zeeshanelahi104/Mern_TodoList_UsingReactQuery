const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const todoRoutes = require("./src/routes/todoRoutes");
app.use("/", todoRoutes);

// Mongodb connection
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully!");
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

// Connect to MongoDB
connectToDatabase();
