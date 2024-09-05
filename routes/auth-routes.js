const express = require("express");
const { signup, login, getUser, getAllUsers } = require("../controllers/auth-controller");
const checkAuth = require("../controllers/middleware/check-auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", checkAuth, getUser);

// New route to get all users (without authentication for now, you can add `checkAuth` if you want it to be protected)
router.get("/users", getAllUsers); // Fetch all users (names and emails)

module.exports = router;
