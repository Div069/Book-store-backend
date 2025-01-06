const express = require("express");
const { getLibraryStats } = require("../controllers/dashboard-controller");
const checkAuth = require("../controllers/middleware/check-auth");
const adminCheck = require("../controllers/middleware/admin-check");

const router = express.Router();

// Route for fetching library statistics
router.get("/stats", checkAuth, getLibraryStats); // Available to all authenticated users

module.exports = router;
