import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import "./CreateProjectForm.css";

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);

  // Get user ID and token from localStorage
  const authUserId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    window.scrollTo(0, 0);
    // Redirect to signin if not authenticated
    if (!authUserId || !authToken) {
      navigate("/signin");
    }
  }, [navigate, authUserId, authToken]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    createdBy: authUserId || "", // Use real user ID
  });

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
    setError(null);

    if (!authUserId || !authToken) {
      setError("You must be logged in to create a project");
      navigate("/signin");
      return;
    }

    try {
      const res = await fetch("/att/auth/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("✅ Project Saved:", data);
      navigate(`/teamselection/${data.project._id}`);
    } catch (error) {
      console.error("❌ Error saving project:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <AsideBar
        isAsideBarVisible={isAsideBarVisible}
        handleAsideBarToggle={() => setIsAsideBarVisible(!isAsideBarVisible)}
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
