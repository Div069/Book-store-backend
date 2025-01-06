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

router.get("/", getAllBooks);

router.post("/add-or-update", checkAuth, addOrUpdateBook);
router.post("/", checkAuth, addBook);

router.put("/:bookId/request", checkAuth, requestBookAccess);
router.get("/user-books", checkAuth, getUserBooks); 

router.delete("/:bookId", checkAuth, deleteBook);


module.exports = router;
