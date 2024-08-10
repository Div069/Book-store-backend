const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/book-routes");
const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/books", router); // localhost:5000/books

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:DDoNj1ys9iGy0nS3@cluster.ttw1d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
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
