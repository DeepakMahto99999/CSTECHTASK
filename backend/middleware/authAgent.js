// middlewares/authAgent.js
import jwt from "jsonwebtoken";

const authAgent = (req, res, next) => {
  try {
    // Get token from "Authorization" header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the token belongs to an agent
    if (decoded.role !== "agent") {
      return res.status(403).json({ success: false, message: "Not authorized as agent" });
    }

    // Attach decoded agent info to req
    req.user = decoded; // ✅ will contain { id, email, role: "agent" }

    next();
  } catch (error) {
    console.error("AuthAgent Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authAgent;
