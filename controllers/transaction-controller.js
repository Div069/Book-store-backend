const Transaction = require("../model/Transaction");
const Book = require("../model/Book");
const User = require("../model/User");


exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("bookId", "name") 
      .populate("userId", "name email");

    res.status(200).json({ transactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
};

exports.borrowBook = async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: "Book is not available for borrowing." });
    }

    book.ownerId = req.user.id; 
    book.available = false;

    await book.save();


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

    book.ownerId = null;
    book.available = true;

    await book.save();


    transaction.action = "RETURN";
    transaction.timestamp = new Date();
    await transaction.save();

    res.status(200).json({ message: "Book returned successfully", transaction });
  } catch (err) {
    console.error("Error returning book:", err);
    res.status(500).json({ message: "Failed to return book", error: err.message });
  }
};
