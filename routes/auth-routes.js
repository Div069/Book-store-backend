const express = require("express");
const { signup, login, getUser, getAllUsers } = require("../controllers/auth-controller");
const checkAuth = require("../controllers/middleware/check-auth");  // Middleware to check authentication

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/user", checkAuth, getUser);  
router.get("/users", checkAuth, getAllUsers);  

module.exports = router;
