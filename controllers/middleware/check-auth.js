const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Expect "Bearer TOKEN"
    if (!token) {
      throw new Error("Authentication failed!token missing");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { email: decodedToken.email, id: decodedToken.userId };
    console.log("User decoded from token:", req.user);
    console.log("Token:", token);  // This should log the token
    console.log("Decoded Token:", decodedToken);  // Add logging here
    next();
  } catch (err) {
    res.status(401).json({ message: "Authentication failed" });
  }
 // This should log the decoded token data

};

module.exports = checkAuth;