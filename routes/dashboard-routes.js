const express = require("express");
const { getLibraryStats } = require("../controllers/dashboard-controller");
const checkAuth = require("../controllers/middleware/check-auth");
const adminCheck = require("../controllers/middleware/admin-check");

const router = express.Router();

router.get("/stats", checkAuth, getLibraryStats); 

module.exports = router;
