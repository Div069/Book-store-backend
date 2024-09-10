require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const bookRoutes = require("./routes/book-routes");
const authRoutes = require("./routes/auth-routes");  // Add authentication routes

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/books", bookRoutes);  // Routes for books
app.use("/auth", authRoutes);   // Routes for authentication and user management

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Replace with your MongoDB connection string (or environment variable)
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://admin:DDoNj1ys9iGy0nS3@cluster.ttw1d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster",
      { useNewUrlParser: true, useUnifiedTopology: true }  // Ensure connection options are correct
    );
    console.log("Connected To Database");

    // Start server
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
  }
};

// Start the server
startServer();
