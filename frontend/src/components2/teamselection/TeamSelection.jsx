import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import "./TeamSelection.css";

const TeamSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state?.projectId;
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const authUserId = localStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("TeamSelection: Checking projectId and auth", {
      projectId,
      authToken,
      authUserId,
    });

    if (!projectId) {
      console.log("TeamSelection: No projectId in location.state");
      setError("No project selected. Please create a project first.");
      navigate("/createprojectform");
      return;
    }

    if (!authToken || !authUserId) {
      console.log("TeamSelection: Redirecting to /signin");
      navigate("/signin", { state: { from: "/teamselection" } });
      return;
    }

    // Fetch project details
    const fetchProject = async () => {
      try {
        console.log(
          "TeamSelection: Fetching project details for projectId:",
          projectId
        );
        const res = await fetch("/att/auth/projects/details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ projectId }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }
        const data = await res.json();
        console.log("TeamSelection: Project fetched", data);
        setProject(data);
      } catch (err) {
        console.error("TeamSelection: Error fetching project", err);
        setError(
          err.message || "Failed to load project details. Please try again."
        );
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      try {
        console.log("TeamSelection: Fetching users");
        const res = await fetch("/att/auth/projects/users", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }
        const data = await res.json();
        console.log("TeamSelection: Users fetched", data);
        setUsers(data);
      } catch (err) {
        console.error("TeamSelection: Error fetching users", err);
        setError(
          err.message || "Failed to load team members. Please try again."
        );
      }
    };

    fetchProject();
    fetchUsers();
  }, [projectId, authToken, authUserId, navigate]);

  const departments = [
    "All Departments",
    ...new Set(users.map((user) => user.department).filter(Boolean)),
  ];

  const toggleMemberSelection = (userId) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.includes(userId);
      if (isSelected) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const filteredMembers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      user.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleCreateProject = async () => {
    if (selectedMembers.length === 0) {
      setError("Please select at least one team member");
      console.log("TeamSelection: No members selected");
      return;
    }
    if (
      !window.confirm(`Add ${selectedMembers.length} member(s) to the project?`)
    ) {
      console.log("TeamSelection: User cancelled team selection");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("TeamSelection: Submitting members", {
        projectId,
        members: selectedMembers,
      });
      const res = await fetch("/att/auth/projects/members", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ projectId, members: selectedMembers }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("TeamSelection: Error response from server", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();
      console.log("✅ Team members added:", data);
      window.scrollTo(0, 0);
      navigate("/projectdashboard", { state: { projectId } });
    } catch (error) {
      console.error("❌ Error adding team members:", error);
      setError(
        error.message || "Failed to save team members. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    navigate(-1);
  };

  return (
    <>
      <AsideBar
        isAsideBarVisible={isAsideBarVisible}
        handleAsideBarToggle={() => setIsAsideBarVisible(!isAsideBarVisible)}
      />

      <div className="team-selection-page">
        <div className="page-headerteam">
          <h1>Select Team</h1>
          <div className="project-info">
            <h2>{project?.name || "Loading..."}</h2>
            <p className="date-range">
              {project
                ? `${new Date(
                    project.startDate
                  ).toLocaleDateString()} - ${new Date(
                    project.endDate
                  ).toLocaleDateString()}`
                : "Loading..."}
            </p>
            <p className="project-description">
              {project?.description || "No description available"}
            </p>
          </div>
        </div>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}
          >
            {error}
          </div>
        )}

        <div className="content-container">
          <div className="selection-section">
            <div className="section-header">
              <h2>Select Team Members</h2>
            </div>

            <div className="filters-container">
              <div className="search-container">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search by name or staff number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="department-container">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="department-select"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="team-section">
              <div className="members-grid">
                {filteredMembers.length === 0 ? (
                  <p>
                    {users.length === 0
                      ? "Loading team members..."
                      : "No users found"}
                  </p>
                ) : (
                  filteredMembers.map((user) => (
                    <div
                      key={user._id}
                      className={`member-card ${
                        selectedMembers.includes(user._id) ? "selected" : ""
                      }`}
                      onClick={() => toggleMemberSelection(user._id)}
                    >
                      <div className="member-details">
                        <h4>{user.fullName}</h4>
                        <p>
                          {user.employeeId} - {user.department}
                        </p>
                      </div>
                      <div className="member-action">
                        {selectedMembers.includes(user._id) ? (
                          <i className="fas fa-check-circle selected-icon"></i>
                        ) : (
                          <button className="add-button">+ Add</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="selected-section">
            <div className="selected-header">
              <h3>Selected Team</h3>
              <span className="count-badge">{selectedMembers.length}</span>
            </div>

            {selectedMembers.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-users"></i>
                <p>No team members selected yet</p>
              </div>
            ) : (
              <div className="selected-list">
                {users
                  .filter((user) => selectedMembers.includes(user._id))
                  .map((user) => (
                    <div key={user._id} className="selected-item">
                      <div className="selected-info">
                        <span className="member-name">{user.fullName}</span>
                        <span className="member-details">
                          {user.department}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleMemberSelection(user._id)}
                        className="remove-btn"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleBack} className="back-button">
            Back to Project Details
          </button>
          <button
            onClick={handleCreateProject}
            className="create-button"
            disabled={selectedMembers.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Team"}
          </button>
        </div>
      </div>
    </>
  );
};

export default TeamSelection;
