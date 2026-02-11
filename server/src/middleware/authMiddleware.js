import jwt from "jsonwebtoken";

// Middleware: Verify JWT Token
export const verifyToken = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: "Bearer <token>"

  if (!token) {
    console.warn("No token provided in request headers");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully:", decoded);

    // Attach decoded user info to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
