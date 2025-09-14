import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc Register new user
export const registerUser = async (req, res) => {
  const { fullName, email, password, role, department, employeeId } = req.body;

  try {
    console.log("Register request body:", req.body);
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password, // Stored as plain text
      role,
      department,
      employeeId,
    });

    const response = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      token: generateToken(user._id),
    };
    console.log("Register response:", response);
    res.status(201).json(response);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login failed: User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      console.log("Login failed: Incorrect password for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const response = {
      message: "Login successful",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      token: generateToken(user._id),
    };
    console.log("Login response:", response);
    res.json(response);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
