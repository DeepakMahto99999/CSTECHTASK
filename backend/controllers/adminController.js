import bcrypt from 'bcrypt';
import agentModel from '../models/agentModel.js';
import jwt from 'jsonwebtoken'
import XLSX from "xlsx";

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



const REQUIRED_COLUMNS = ["FirstName", "Phone", "Notes"];

export const uploadList = async (req, res) => {
  try {
    // 1. File validation
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileExtension)) {
      return res.status(400).json({ success: false, message: "Invalid file type. Only CSV/XLSX/XLS allowed." });
    }

    // 2. Parse file
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "File is empty" });
    }

    // 3. Validate headers
    const fileColumns = Object.keys(rows[0]);
    const missingCols = REQUIRED_COLUMNS.filter(col => !fileColumns.includes(col));
    if (missingCols.length > 0) {
      return res.status(400).json({ success: false, message: `Missing columns: ${missingCols.join(", ")}` });
    }

    // 4. Validate row types
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (typeof row.FirstName !== "string") {
        return res.status(400).json({ success: false, message: `Row ${i + 1}: FirstName must be text` });
      }
      if (isNaN(Number(row.Phone))) {
        return res.status(400).json({ success: false, message: `Row ${i + 1}: Phone must be number` });
      }
      if (typeof row.Notes !== "string") {
        return res.status(400).json({ success: false, message: `Row ${i + 1}: Notes must be text` });
      }
    }

    // 5. Fetch agents
    let agents = await agentModel.find().sort({ createdAt: 1 }); // oldest first
    if (agents.length < 5) {
      return res.status(400).json({ success: false, message: "You must create exactly 5 agents before uploading a list" });
    }
    if (agents.length > 5) {
      agents = agents.slice(0, 5); // only first 5
    }

    // 6. Distribution logic
    const totalRows = rows.length;
    const base = Math.floor(totalRows / 5);
    let remainder = totalRows % 5;

    let distributedData = {};
    let rowIndex = 0;

    for (let i = 0; i < 5; i++) {
      let count = base + (remainder > 0 ? 1 : 0);
      remainder = remainder > 0 ? remainder - 1 : remainder;

      let agentRows = rows.slice(rowIndex, rowIndex + count).map(r => ({
        firstName: r.FirstName,
        phone: r.Phone,
        notes: r.Notes
      }));

      // Assign to agent
      agents[i].assignedData.push(...agentRows);
      await agents[i].save();

      distributedData[agents[i].name] = agentRows;
      rowIndex += count;
    }

    return res.json({
      success: true,
      message: "File uploaded and distributed successfully",
      distributedData
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getAgentsWithData = async (req, res) => {
  try {
    // fetch only 5 agents
    const agents = await agentModel.find().limit(5);
    res.json({ success: true, agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

