const Book = require("../model/Book");
const User = require("../model/User");

// Fetch all books or fetch books for a specific user
const getAllBooks = async (req, res, next) => {
  let books;
  try {
    books = await Book.find().populate('ownerId', 'username email');
  } catch (err) {
    console.log("Error fetching books:", err);
    return res.status(500).json({ message: "Fetching books failed" });
  }
  if (!books) {
    return res.status(404).json({ message: "No books found" });
  }
  return res.status(200).json({ books });
};

const addBook = async (req, res) => {
  const { name, author, description, price, image, available } = req.body;


  try {
    const isAdmin = req.user.email === "admin@example.com";  // Check if the user is an admin

    const newBook = new Book({
      name,
      author,
      description,
      price,
      available: true,  // Admin sets availability, non-admins cannot
      image,
      ownerId: null,  // Admin books have no ownerId
    });

    await newBook.save();
    res.status(201).json({ book: newBook });
  } catch (err) {
    console.error("Error adding book:", err);  // Log any error
    res.status(500).json({ message: "Error adding the book." });
  }
};

// Request access to a book (Regular users request books owned by admin)
const requestBookAccess = async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Log the current book status before requesting access

    if (book.available) {
      book.ownerId = userId;
      book.available = false;

      await book.save();

      // Log the updated book status after requesting access

      res.status(200).json({ message: "Book successfully requested.", book });
    } else {
      res.status(400).json({ message: "Book is already unavailable." });
    }
  } catch (err) {
    console.error("Error requesting the book:", err);
    res.status(500).json({ message: "Error requesting the book." });
  }
};



// Delete a book (Admin can delete any book)
// Delete a book (Admin can delete any book, Non-Admin only removes it from their inventory and makes it available)
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
      await Book.deleteOne({ _id: bookId });  // Use deleteOne instead of remove
      res.status(200).json({ message: "Book deleted from the database successfully." });
    } else if (book.ownerId && book.ownerId.toString() === req.user.id) {
      // Non-admin can only remove the book from their collection and make it available
      book.ownerId = null;
      book.available = true;

      await book.save();
      res.status(200).json({ message: "Book removed from your inventory and made available." });
    } else {
      res.status(403).json({ message: "You are not authorized to delete this book." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting the book." });
  }
};



// Update book details (Owner of the book can update)


const addOrUpdateBook = async (req, res) => {
  const { name, author, description, price, image } = req.body;

  try {
    // Check if a book with the same name exists
    let book = await Book.findOne({ name });

    // If book exists, update the existing book
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

    // If book does not exist, create a new one
    book = new Book({
      name,
      author,
      description,
      price,
      available: req.user.email === "admin@example.com", // Admin books are available by default
      image,
      ownerId: req.user.id, // Set the owner as the logged-in user
    });

    await book.save();
    return res.status(201).json({ message: "Book added successfully.", book });

  } catch (err) {
    console.error("Error adding or updating book:", err);
    res.status(500).json({ message: "Error adding or updating the book." });
  }
};


const getUserBooks = async (req, res, next) => {
  const userId = req.user.id;  // Extract user ID from the authenticated user in the request
  let books;

  try {
    // Find books where the owner's ID matches the logged-in user's ID
    books = await Book.find({ ownerId: userId }).populate('ownerId', 'username email');
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
  getUserBooks,  // Export the new controller
  addBook,
  requestBookAccess,
  deleteBook,
  addOrUpdateBook,
};