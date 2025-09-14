import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import "./CreateProjectForm.css";

const CreateProjectForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);
  const handleAsideBarToggle = () => {
    setIsAsideBarVisible(!isAsideBarVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    window.scrollTo(0, 0);
    navigate(-1);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/att/auth/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("✅ Project Saved:", data);

      navigate("/teamselection");
    } catch (error) {
      console.error("❌ Error saving project:", error);
    }
  };

  return (
    <>
      <AsideBar
        isAsideBarVisible={isAsideBarVisible}
        handleAsideBarToggle={handleAsideBarToggle}
      />

      <div className="create-project-page">
        <div className="page-header">
          <h1>Create New Field Project</h1>
          <p>
            Set up a new field project with team assignment and date tracking
          </p>
        </div>

        <div className="form-container">
          <form onSubmit={handleProjectSubmit} className="project-form">
            <div className="form-group">
              <label htmlFor="projectName">Project Name *</label>
              <input
                type="text"
                id="projectName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className="modern-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectDescription">Description</label>
              <textarea
                id="projectDescription"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description (optional)"
                rows="3"
                className="modern-textarea"
              />
            </div>

            <div className="date-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="modern-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="modern-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="continue-btn"
                onClick={handleProjectSubmit}
              >
                Continue to Team Selection
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProjectForm;
