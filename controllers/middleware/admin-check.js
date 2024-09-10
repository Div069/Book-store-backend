module.exports = (req, res, next) => {
    const adminEmail = "admin@example.com";  // Ensure this matches your admin email
  
    if (req.user.email === adminEmail) {
      req.user.isAdmin = true;
    } else {
      req.user.isAdmin = false;
    }
  
    next();
  };
  