const express = require("express");
const {
  getAllBooks,
  requestBookAccess,
  deleteBook,
  getUserBooks,
  addOrUpdateBook,
  sseNotifications, // Import SSE notifications
} = require("../controllers/books-controller");
const checkAuth = require("../controllers/middleware/check-auth");

const router = express.Router();

router.get("/", getAllBooks);

router.post("/add-or-update", checkAuth, addOrUpdateBook);

router.put("/:bookId/request", checkAuth, requestBookAccess);
router.get("/user-books", checkAuth, getUserBooks);

router.delete("/:bookId", checkAuth, deleteBook);

// SSE notifications route
router.get("/notifications", sseNotifications);

module.exports = router;
