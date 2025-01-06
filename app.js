require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes = require("./routes/book-routes");
const authRoutes = require("./routes/auth-routes");
const transactionRoutes = require("./routes/transaction-routes"); 
const dashboardRoutes = require("./routes/dashboard-routes.js"); 

const app = express();

app.use(express.json());
app.use(cors());

app.use("/books", bookRoutes); 
app.use("/auth", authRoutes); 
app.use("/transactions", transactionRoutes); 
app.use("/dashboard", dashboardRoutes); 



const startServer = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://admin:DDoNj1ys9iGy0nS3@cluster.ttw1d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster",
      { useNewUrlParser: true, useUnifiedTopology: true } 
    );
    console.log("Connected To Database");

    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (err) {
    console.error("Failed to connect to the database", err);
  }
};

startServer();
