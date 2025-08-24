import agentModel from "../models/agentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await agentModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: "agent" }, // include role if needed
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({ success: true, token, message: "Login successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAgentData = async (req, res) => {
  try {

    const agent = await agentModel.findById(req.user.id);

    if (!agent) {
      return res.status(404).json({ success: false, message: "Agent not found" })
    }

    res.json({
      success: true,
      agent: {
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        assignedData: agent.assignedData,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};