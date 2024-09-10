const express = require("express");
const { signup, login, getUser, getAllUsers } = require("../controllers/auth-controller");
const checkAuth = require("../controllers/middleware/check-auth");  // Middleware to check authentication

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/user", checkAuth, getUser);  // Protected route to get user info
router.get("/users", checkAuth, getAllUsers);  // Protected route to get all users

module.exports = router;
