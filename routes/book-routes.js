const express = require("express");
const {
  getAllBooks,
  addBook,
  requestBookAccess,
  deleteBook,
  getUserBooks,
  addOrUpdateBook
} = require("../controllers/books-controller");
const checkAuth = require("../controllers/middleware/check-auth");

const router = express.Router();

// Route to get all books or get books by userId for MyBooks
router.get("/", getAllBooks);

router.post("/add-or-update", checkAuth, addOrUpdateBook);
// Route to add a new book (admin can add books globally available, others can add to their collection)
router.post("/", checkAuth, addBook);

// Route to request access to a book (only available books can be requested)
router.put("/:bookId/request", checkAuth, requestBookAccess);
router.get("/user-books", checkAuth, getUserBooks);  // Add this new route

// Route to delete a book (admin can delete any book, users can delete their own books)
router.delete("/:bookId", checkAuth, deleteBook);


module.exports = router;
