import bcrypt from 'bcrypt';
import agentModel from '../models/agentModel.js';
import jwt from 'jsonwebtoken'

export const addAgent = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // 2. Validate strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // 3. Check if email or mobile already exists
        const existingAgent = await agentModel.findOne({ $or: [{ email }, { mobile }] });
        if (existingAgent) {
            return res.status(400).json({ success: false, message: "Email or mobile already registered" });
        }

        // 4. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Save new agent
        const newAgent = new agentModel({
            name,
            email,
            password: hashedPassword,
            mobile
        });

        await newAgent.save();

        // 6. Success response
        res.status(201).json({ success: true, message: "Agent Added Successfully" });

    } catch (error) {
        console.error("Error in addAgent:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    // 2. Check credentials against env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // 3. Create structured payload
      const payload = {
        email,
        role: "admin", // <-- useful for middleware checks
      };

      // 4. Sign JWT with expiry
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



