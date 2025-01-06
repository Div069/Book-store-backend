const Transaction = require("../model/Transaction");
const Book = require("../model/Book");
const User = require("../model/User");

// Fetch all transactions (Admin only)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("bookId", "name") // Include book name
      .populate("userId", "name email"); // Include user name and email

    res.status(200).json({ transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
};

// Borrow a book
exports.borrowBook = async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: "Book is not available for borrowing." });
    }

    book.ownerId = req.user.id; // Assign the book to the borrower
    book.available = false;

    await book.save();

    // Log the borrow transaction
    const transaction = new Transaction({
      bookId: book._id,
      userId: req.user.id,
      action: "BORROW",
    });
    await transaction.save();

    res.status(200).json({ message: "Book borrowed successfully", transaction });
  } catch (err) {
    console.error("Error borrowing book:", err);
    res.status(500).json({ message: "Failed to borrow book", error: err.message });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const book = await Book.findById(transaction.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    book.ownerId = null; // Make the book available again
    book.available = true;

    await book.save();

    // Update the transaction to mark the return
    transaction.action = "RETURN";
    transaction.timestamp = new Date();
    await transaction.save();

    res.status(200).json({ message: "Book returned successfully", transaction });
  } catch (err) {
    console.error("Error returning book:", err);
    res.status(500).json({ message: "Failed to return book", error: err.message });
  }
};
