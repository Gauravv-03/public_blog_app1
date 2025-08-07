const jwt = require("jsonwebtoken");
require("dotenv").config();

function authMiddleware(req, res, next) {


  console.log("Inside authmiddleware");
//   const authHeader = req.headers.authorization;
//   console.log("authHeader",authHeader)

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

// //   const token = authHeader.split(" ")[1];
// const token = authHeader.replace("Bearer ", "");

console.log("cookiee )))))",req.cookies);
const token = req.cookies?.token;
  console.log("token ___+++++",token);
  if (!token) {
    console.error("Token verification failed:");

        res.locals.isAuthenticated = false;
    return res.redirect("/api/auth/loginPage");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(" Decoded user from token:", decoded);
    

      res.locals.isAuthenticated = true;
    res.locals.user = decoded;

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.locals.isAuthenticated = false;
    return res.redirect("/api/auth/loginPage");
    // return res.status(401).json({ message: "Unauthorized: Invalid token" });
    //  return res.redirect("/api/auth/loginPage");
  }
}

module.exports = authMiddleware;
