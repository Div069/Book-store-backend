const Book = require("../model/Book");
const User = require("../model/User");
const Transaction = require("../model/Transaction"); // Import the Transaction model

// Fetch all books or fetch books for a specific user
const getAllBooks = async (req, res, next) => {
  let books;
  try {
    books = await Book.find().populate("ownerId", "username email");
  } catch (err) {
    console.log("Error fetching books:", err);
    return res.status(500).json({ message: "Fetching books failed" });
  }
  if (!books) {
    return res.status(404).json({ message: "No books found" });
  }
  return res.status(200).json({ books });
};

// Add a book and log the transaction
const addBook = async (req, res) => {
  const { name, author, description, price, image } = req.body;

  try {
    const newBook = new Book({
      name,
      author,
      description,
      price,
      available: true, // Default to available
      image,
      ownerId: req.user.id, // Set the logged-in user as the owner
    });

    await newBook.save();

    // Log the add transaction
    const transaction = new Transaction({
      bookId: newBook._id,
      userId: req.user.id,
      action: "ADD",
    });
    await transaction.save();

    res.status(201).json({ book: newBook });
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ message: "Error adding the book." });
  }
};

// Request access to a book and log the transaction
const requestBookAccess = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    if (book.available) {
      book.ownerId = req.user.id; // Assign the book to the requesting user
      book.available = false;

      await book.save();

      // Log the request transaction
      const transaction = new Transaction({
        bookId: book._id,
        userId: req.user.id,
        action: "REQUEST",
      });
      await transaction.save();

      res.status(200).json({ message: "Book successfully requested.", book });
    } else {
      res.status(400).json({ message: "Book is already unavailable." });
    }
  } catch (err) {
    console.error("Error requesting the book:", err);
    res.status(500).json({ message: "Error requesting the book." });
  }
};

// Delete a book and log the transaction
const deleteBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const isAdmin = req.user.email === "admin@example.com";

    if (isAdmin) {
      // Admin can delete the book entirely from the database
      await Book.deleteOne({ _id: bookId });

      // Log the delete transaction for admin
      const transaction = new Transaction({
        bookId: bookId,
        userId: req.user.id,
        action: "DELETE_DB",
      });
      await transaction.save();

      res.status(200).json({ message: "Book deleted from the database successfully." });
    } else if (book.ownerId && book.ownerId.toString() === req.user.id) {
      // Non-admin can only remove the book from their collection
      book.ownerId = null;
      book.available = true;

      await book.save();

      const transaction = new Transaction({
        bookId: bookId,
        userId: req.user.id,
        action: "REMOVE",
      });
      await transaction.save();

      res.status(200).json({ message: "Book removed from your inventory and made available." });
    } else {
      res.status(403).json({ message: "You are not authorized to delete this book." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting the book." });
  }
};

const addOrUpdateBook = async (req, res) => {
  const { name, author, description, price, image } = req.body;

  try {
    let book = await Book.findOne({ name });

    if (book) {
      const isAdmin = req.user.email === "admin@example.com";
      if (isAdmin || book.ownerId.toString() === req.user.id) {
        book.author = author;
        book.description = description;
        book.price = price;
        book.image = image;

        await book.save();
        return res.status(200).json({ message: "Book updated successfully.", book });
      } else {
        return res.status(403).json({ message: "You are not authorized to update this book." });
      }
    }

    book = new Book({
      name,
      author,
      description,
      price,
      available: req.user.email === "admin@example.com",
      image,
      ownerId: req.user.id,
    });

    await book.save();
    return res.status(201).json({ message: "Book added successfully.", book });
  } catch (err) {
    console.error("Error adding or updating book:", err);
    res.status(500).json({ message: "Error adding or updating the book." });
  }
};

const getUserBooks = async (req, res, next) => {
  const userId = req.user.id;
  let books;

  try {
    books = await Book.find({ ownerId: userId }).populate("ownerId", "username email");
  } catch (err) {
    console.error("Error fetching user's books:", err);
    return res.status(500).json({ message: "Error fetching user's books." });
  }

  if (!books || books.length === 0) {
    return res.status(404).json({ message: "No books found for this user." });
  }

  return res.status(200).json({ books });
};

module.exports = {
  getAllBooks,
  getUserBooks,
  addBook,
  requestBookAccess,
  deleteBook,
  addOrUpdateBook,
};
