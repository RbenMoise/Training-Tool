import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Project from "../models/Project.js";
import User from "../models/User.js";

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
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Auth Middleware: Invalid token", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// @desc Get all users (for team selection)
router.get("/users", authMiddleware, async (req, res) => {
  console.log("GET /att/auth/projects/users: Fetching users");
  try {
    const users = await User.find({}, "fullName employeeId department");
    if (!users || users.length === 0) {
      console.log("No users found");
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Server error while fetching users",
      error: error.message,
    });
  }
});

// @desc Create new project
router.post("/", authMiddleware, async (req, res) => {
  console.log("POST /att/auth/projects: Received request", req.body);
  try {
    const { name, description, startDate, endDate, createdBy } = req.body;

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

    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      console.log("Validation failed: Invalid createdBy ID format", createdBy);
      return res.status(400).json({ message: "Invalid createdBy ID format" });
    }

    if (!User) {
      console.error("User model is not defined. Check the model import.");
      throw new Error("User model is not defined. Check the model import.");
    }

    console.log("Checking user existence for createdBy:", createdBy);
    const userExists = await User.findById(createdBy);
    if (!userExists) {
      console.log("User not found for createdBy:", createdBy);
      return res
        .status(400)
        .json({ message: "User with provided createdBy ID does not exist" });
    }

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

// @desc Update project members
router.patch("/members", authMiddleware, async (req, res) => {
  console.log("PATCH /att/auth/projects/members: Received request", req.body);
  try {
    const { projectId, members } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.log("Invalid projectId format:", projectId);
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    if (!members || !Array.isArray(members)) {
      console.log("Invalid members format:", members);
      return res
        .status(400)
        .json({ message: "Members must be an array of user IDs" });
    }

    for (const memberId of members) {
      if (!mongoose.Types.ObjectId.isValid(memberId)) {
        console.log("Invalid member ID format:", memberId);
        return res
          .status(400)
          .json({ message: `Invalid member ID format: ${memberId}` });
      }
      const userExists = await User.findById(memberId);
      if (!userExists) {
        console.log("User not found for member ID:", memberId);
        return res
          .status(400)
          .json({ message: `User with ID ${memberId} does not exist` });
      }
    }

    const project = await Project.findById(projectId);
    if (!project) {
      console.log("Project not found:", projectId);
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.userId) {
      console.log("Unauthorized: User is not the project creator", {
        userId: req.userId,
        createdBy: project.createdBy,
      });
      return res.status(403).json({
        message: "Unauthorized: Only the project creator can update members",
      });
    }

    project.members = members;
    await project.save();

    console.log("Project members updated:", project);
    res.json({ message: "Project members updated successfully", project });
  } catch (error) {
    console.error("Error updating project members:", error);
    res.status(500).json({
      message: "Server error while updating project members",
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

// @desc Get project details by ID (in body)
router.post("/details", authMiddleware, async (req, res) => {
  console.log("POST /att/auth/projects/details: Received request", req.body);
  try {
    const { projectId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.log("Invalid projectId format:", projectId);
      return res.status(400).json({ message: "Invalid project ID format" });
    }
    const project = await Project.findById(projectId)
      .populate("createdBy", "fullName employeeId")
      .populate("members", "fullName employeeId");
    if (!project) {
      console.log("Project not found:", projectId);
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      message: "Server error while fetching project",
      error: error.message,
    });
  }
});

// @desc Get single project (for compatibility)
router.get("/:projectId", authMiddleware, async (req, res) => {
  console.log(
    "GET /att/auth/projects/:projectId: Fetching project",
    req.params
  );
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.log("Invalid projectId format:", projectId);
      return res.status(400).json({ message: "Invalid project ID format" });
    }
    const project = await Project.findById(projectId)
      .populate("createdBy", "fullName employeeId")
      .populate("members", "fullName employeeId");
    if (!project) {
      console.log("Project not found:", projectId);
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      message: "Server error while fetching project",
      error: error.message,
    });
  }
});

export default router;
