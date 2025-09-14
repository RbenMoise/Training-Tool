import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc Register new user
export const registerUser = async (req, res) => {
  const { fullName, email, password, role, department, employeeId } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role,
      department,
      employeeId,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      token: generateToken(user._id),
    });
  } catch (error) {
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
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Plain password check (⚠️ insecure, but works for demo)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
