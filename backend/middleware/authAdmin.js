import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    // Get token from "Authorization" header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // extract token

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the token belongs to an admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized as admin" });
    }

    // Attach decoded data (optional) for later use
    req.admin = decoded;

    next(); // continue
  } catch (error) {
    console.error("AuthAdmin Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAdmin;
