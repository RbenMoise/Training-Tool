import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// @desc Create new project
router.post("/", async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;

    const project = new Project({ name, description, startDate, endDate });
    await project.save();

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
});

// @desc Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

export default router;
