const Book = require("../model/Book");
const User = require("../model/User");

exports.getLibraryStats = async (req, res) => {
  try {

    const totalBooks = await Book.countDocuments();


    const availableBooks = await Book.countDocuments({ available: true });

    
    const borrowedBooks = totalBooks - availableBooks;

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
