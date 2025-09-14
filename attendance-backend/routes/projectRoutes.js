import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Project from "../models/Project.js";
import User from "../models/User.js"; // Updated to User.js

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  console.log("Auth Middleware: Processing request", req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("Auth Middleware: No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    console.log("Auth Middleware: Token decoded", decoded);
    req.userId = decoded.userId; // Assume token contains userId
    next();
  } catch (error) {
    console.log("Auth Middleware: Invalid token", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// @desc Create new project
router.post("/", authMiddleware, async (req, res) => {
  console.log("POST /att/auth/projects: Received request", req.body);
  try {
    const { name, description, startDate, endDate, createdBy } = req.body;

    // Validate required fields
    if (!name || !startDate || !endDate || !createdBy) {
      console.log("Validation failed: Missing required fields", {
        name,
        startDate,
        endDate,
        createdBy,
      });
      return res.status(400).json({
        message:
          "Missing required fields: name, startDate, endDate, or createdBy",
      });
    }

    // Validate createdBy is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      console.log("Validation failed: Invalid createdBy ID format", createdBy);
      return res.status(400).json({ message: "Invalid createdBy ID format" });
    }

    // Check if User model is available
    if (!User) {
      console.error("User model is not defined. Check the model import.");
      throw new Error("User model is not defined. Check the model import.");
    }

    // Check if createdBy user exists
    console.log("Checking user existence for createdBy:", createdBy);
    const userExists = await User.findById(createdBy);
    if (!userExists) {
      console.log("User not found for createdBy:", createdBy);
      return res
        .status(400)
        .json({ message: "User with provided createdBy ID does not exist" });
    }

    // Ensure createdBy matches authenticated user
    if (createdBy !== req.userId) {
      console.log("Unauthorized: createdBy does not match authenticated user", {
        createdBy,
        userId: req.userId,
      });
      return res.status(403).json({
        message: "Unauthorized: createdBy does not match authenticated user",
      });
    }

    const project = new Project({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy,
      members: [],
    });

    console.log("Saving project:", project);
    await project.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      console.log("ValidationError:", errors);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    if (error.name === "ReferenceError") {
      console.error("ReferenceError in project creation:", error);
      return res.status(500).json({
        message: "Server error: Model not found",
        error: error.message,
      });
    }
    console.error("Error creating project:", error);
    res.status(500).json({
      message: "Server error while creating project",
      error: error.message,
    });
  }
});

// @desc Get all projects
router.get("/", authMiddleware, async (req, res) => {
  console.log("GET /att/auth/projects: Fetching projects");
  try {
    const projects = await Project.find()
      .populate("createdBy", "fullName employeeId")
      .populate("members", "fullName employeeId");
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      message: "Server error while fetching projects",
      error: error.message,
    });
  }
});

export default router;
