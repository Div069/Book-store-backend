// routes/auth-routes.js
const express = require("express");
const { signup, login, getUser } = require("../controllers/auth-controller");
const checkAuth = require("../controllers/middleware/check-auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", checkAuth, getUser);

module.exports = router;
