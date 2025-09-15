import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  FileText,
  User,
  ChevronRight,
  BarChart3,
  Clock,
} from "lucide-react";
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import "./ProjectDashboard.css";

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state?.projectId;
  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState(null);
  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const authUserId = localStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("ProjectDashboard: Checking projectId and auth", {
      projectId,
      authToken,
      authUserId,
    });

    if (!projectId) {
      console.log(
        "ProjectDashboard: No projectId in location.state - redirecting to home"
      );
      navigate("/homeAttendance");
      return;
    }

    if (!authToken || !authUserId) {
      console.log("ProjectDashboard: Redirecting to /signin");
      navigate("/signin", { state: { from: "/projectdashboard" } });
      return;
    }

    // Fetch project details
    const fetchProject = async () => {
      try {
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
        console.log("ProjectDashboard: Project fetched", data);
        setProject(data);
        setTeamMembers(
          data.members.map((member, index) => ({
            id: index + 1,
            _id: member._id,
            name: member.fullName,
            empId: member.employeeId,
            department: member.department || "Unknown",
            attendance: 0,
            daysPresent: 0,
            attendanceRecords: {}, // Initialize for today's attendance
          }))
        );
      } catch (err) {
        console.error("ProjectDashboard: Error fetching project", err);
        setError(
          err.message || "Failed to load project details. Please try again."
        );
      }
    };

    // Fetch attendance stats
    const fetchAttendanceStats = async () => {
      try {
        const res = await fetch("/att/auth/projects/attendance/stats", {
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
        console.log("ProjectDashboard: Attendance stats fetched", data);
        setTeamMembers((prev) =>
          prev.map((member) => ({
            ...member,
            attendance: data.members[member._id]?.attendanceRate || 0,
            daysPresent: data.members[member._id]?.daysPresent || 0,
            attendanceRecords:
              data.members[member._id]?.attendanceRecords || {},
          }))
        );
        setStats([
          {
            icon: Users,
            label: "Team Members",
            value: data.teamMembers,
            color: "#94d500",
          },
          {
            icon: Calendar,
            label: "Total Days",
            value: data.totalDays,
            color: "#e74c3c",
          },
          {
            icon: FileText,
            label: "Days Recorded",
            value: data.daysRecorded,
            color: "#94d500",
          },
          {
            icon: BarChart3,
            label: "Attendance Rate",
            value: `${data.attendanceRate}%`,
            color: "#e74c3c",
          },
        ]);
      } catch (err) {
        console.error("ProjectDashboard: Error fetching attendance stats", err);
        setStats([
          {
            icon: Users,
            label: "Team Members",
            value: project?.members?.length || 0,
            color: "#94d500",
          },
          { icon: Calendar, label: "Total Days", value: "0", color: "#e74c3c" },
          {
            icon: FileText,
            label: "Days Recorded",
            value: "0",
            color: "#94d500",
          },
          {
            icon: BarChart3,
            label: "Attendance Rate",
            value: "0%",
            color: "#e74c3c",
          },
        ]);
      }
    };

    fetchProject();
    if (projectId) fetchAttendanceStats();
  }, [projectId, authToken, authUserId, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRecordAttendancePage = () => {
    window.scrollTo(0, 0);
    navigate("/recordattendance", { state: { projectId } });
  };

  const handleViewReports = () => {
    console.log("Viewing attendance reports for project:", projectId);
    navigate("/attendancereports", { state: { projectId } });
  };

  // Calculate today's attendance
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = teamMembers.reduce(
    (sum, member) => sum + (member.attendanceRecords?.[today]?.present ? 1 : 0),
    0
  );

  return (
    <>
      <AsideBar
        isAsideBarVisible={isAsideBarVisible}
        handleAsideBarToggle={() => setIsAsideBarVisible(!isAsideBarVisible)}
      />
      <div className="dashboard-container">
        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}
          >
            {error}
          </div>
        )}
        {/* Header */}
        <div className="projectheader">
          <div className="projectheader-content">
            <div className="projectheader-main">
              <div className="project-info">
                <div className="project-title-section">
                  <div className="project-indicator"></div>
                  <div className="project-details">
                    <h1 className="project-title">
                      {project?.name || "Loading..."}
                    </h1>
                    <div className="project-meta">
                      <span className="status-badge">
                        {project && new Date(project.endDate) >= new Date()
                          ? "Ongoing"
                          : "Completed"}
                      </span>
                      <span className="project-dates">
                        {project
                          ? `${new Date(
                              project.startDate
                            ).toLocaleDateString()} - ${new Date(
                              project.endDate
                            ).toLocaleDateString()}`
                          : "Loading..."}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="project-description">
                  {project?.description || "(No description available)"}
                </p>

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Project Progress</span>
                    <span>
                      {project
                        ? `${Math.round(
                            ((new Date() - new Date(project.startDate)) /
                              (new Date(project.endDate) -
                                new Date(project.startDate))) *
                              100
                          )}% Complete`
                        : "0% Complete"}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: project
                          ? `${Math.min(
                              Math.round(
                                ((new Date() - new Date(project.startDate)) /
                                  (new Date(project.endDate) -
                                    new Date(project.startDate))) *
                                  100
                              ),
                              100
                            )}%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="header-actions">
                <button
                  onClick={handleRecordAttendancePage}
                  className="btn-primary"
                >
                  Record Attendance
                </button>
                <button onClick={handleViewReports} className="btn-secondary">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="main-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <div className="stat-content">
                    <div
                      className="stat-icon"
                      style={{ backgroundColor: stat.color + "20" }}
                    >
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="projectcontent-grid">
            {/* Today's Attendance */}
            <div className="projectcard">
              <div className="card-header">
                <div className="card-header-content">
                  <h2 className="card-title">Today's Attendance</h2>
                  <div className="card-date">
                    {currentTime.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="attendance-summary">
                  <span className="attendance-text">
                    Present: {todayAttendance} of {teamMembers.length}
                  </span>
                  <span className="attendance-percentage">
                    {teamMembers.length > 0
                      ? Math.round((todayAttendance / teamMembers.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                {todayAttendance === 0 ? (
                  <div className="no-attendance">
                    <Clock className="no-attendance-icon" />
                    <p className="no-attendance-text">
                      No attendance recorded for today
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            {/* Team Members */}
            <div className="projectcard">
              <div className="card-header">
                <h2 className="card-title">Team Members</h2>
              </div>
              <div className="team-list">
                {teamMembers.length === 0 ? (
                  <p>No team members assigned.</p>
                ) : (
                  teamMembers.map((member) => (
                    <div
                      key={member._id}
                      className="team-member"
                      onClick={() => setSelectedMember(member)}
                    >
                      <div className="member-info">
                        <div className="member-avatar">
                          <User size={16} />
                        </div>
                        <div className="member-details">
                          <div className="projectmember-name">
                            {member.name}
                          </div>
                          <div className="member-meta">
                            {member.empId} • {member.department}
                          </div>
                        </div>
                      </div>
                      <div className="member-stats">
                        <div className="member-attendance">
                          <div className="attendance-rate">
                            {Math.round(member.attendance)}%
                          </div>
                          <div className="days-count">
                            {member.daysPresent} days
                          </div>
                        </div>
                        <ChevronRight size={16} className="chevron-icon" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="actions-grid">
              <button
                onClick={handleRecordAttendancePage}
                className="action-card"
              >
                <div className="action-content">
                  <div className="action-header">
                    <div className="action-icon green">
                      <Users size={20} />
                    </div>
                    <h3 className="action-title">Record Daily Attendance</h3>
                  </div>
                  <p className="action-description">
                    Mark team members as present for today
                  </p>
                </div>
                <ChevronRight size={20} className="action-chevron" />
              </button>
              <button onClick={handleViewReports} className="action-card">
                <div className="action-content">
                  <div className="action-header">
                    <div className="action-icon red">
                      <FileText size={20} />
                    </div>
                    <h3 className="action-title">View Attendance Reports</h3>
                  </div>
                  <p className="action-description">
                    Generate and print attendance summaries
                  </p>
                </div>
                <ChevronRight size={20} className="action-chevron" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDashboard;
