const Book = require("../model/Book");
const User = require("../model/User");

exports.getLibraryStats = async (req, res) => {
  try {
    // Total books count
    const totalBooks = await Book.countDocuments();

    // Available books count
    const availableBooks = await Book.countDocuments({ available: true });

    // Borrowed books count = totalBooks - availableBooks
    const borrowedBooks = totalBooks - availableBooks;

    // Total users count
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalBooks,
      borrowedBooks,
      availableBooks,
      totalUsers,
    });
  } catch (err) {
    console.error("Error fetching library stats:", err);
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
};
