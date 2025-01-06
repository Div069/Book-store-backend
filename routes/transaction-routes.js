const express = require("express");
const {
  borrowBook,
  returnBook,
  getAllTransactions,
} = require("../controllers/transaction-controller");
const checkAuth = require("../controllers/middleware/check-auth");
const adminCheck = require("../controllers/middleware/admin-check");

const router = express.Router();

router.post("/borrow", checkAuth, borrowBook);

router.put("/return/:transactionId", checkAuth, returnBook);

router.get("/all", checkAuth, adminCheck, getAllTransactions);

module.exports = router;
