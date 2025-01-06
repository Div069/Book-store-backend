const express = require("express");
const {
  borrowBook,
  returnBook,
  getAllTransactions,
} = require("../controllers/transaction-controller");
const checkAuth = require("../controllers/middleware/check-auth");
const adminCheck = require("../controllers/middleware/admin-check");

const router = express.Router();

// Route for borrowing a book (Authenticated users only)
router.post("/borrow", checkAuth, borrowBook);

// Route for returning a book (Authenticated users only)
router.put("/return/:transactionId", checkAuth, returnBook);

// Route for fetching all transactions (Admin only)
router.get("/all", checkAuth, adminCheck, getAllTransactions);

module.exports = router;
