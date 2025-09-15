import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, CheckCircle, User, Calendar } from "lucide-react";
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import "./RecordAttendance.css";

const RecordAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state?.projectId;
  const authToken = localStorage.getItem("authToken");
  const authUserId = localStorage.getItem("userId");
  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);
  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("RecordAttendance: Checking projectId and auth", {
      projectId,
      authToken,
      authUserId,
    });

    if (!projectId) {
      console.log("RecordAttendance: No projectId in location.state");
      setError("No project selected. Please select a project first.");
      navigate("/homeAttendance");
      return;
    }

    if (!authToken || !authUserId) {
      console.log("RecordAttendance: Redirecting to /signin");
      navigate("/signin", { state: { from: "/recordattendance" } });
      return;
    }

    // Fetch project details and team members
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        console.log(
          "RecordAttendance: Fetching project details for projectId:",
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
          console.error(
            "RecordAttendance: Fetch project error response",
            errorData
          );
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }
        const data = await res.json();
        console.log("RecordAttendance: Project fetched", data);
        setProject(data);
        const members = data.members.map((member, index) => ({
          id: index + 1,
          _id: member._id,
          name: member.fullName,
          empId: member.employeeId,
          department: member.department || "Unknown",
        }));
        setTeamMembers(members);
        // Initialize attendance state
        setAttendance(
          members.reduce(
            (acc, member) => ({
              ...acc,
              [member._id]: { present: false },
            }),
            {}
          )
        );
      } catch (err) {
        console.error("RecordAttendance: Error fetching project", err);
        setError(
          err.message || "Failed to load project details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch existing attendance for today
    const fetchTodayAttendance = async () => {
      try {
        console.log(
          "RecordAttendance: Fetching today's attendance for projectId:",
          projectId
        );
        const res = await fetch("/att/auth/projects/attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ projectId }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error(
            "RecordAttendance: Fetch attendance error response",
            errorData
          );
          throw new Error(
            errorData.message || `HTTP error! status: ${res.status}`
          );
        }
        const data = await res.json();
        console.log("RecordAttendance: Today's attendance fetched", data);
        const todayRecord = data.find(
          (record) =>
            new Date(record.date).toISOString().split("T")[0] === today
        );
        if (todayRecord) {
          const updatedAttendance = {};
          teamMembers.forEach((member) => {
            const record = todayRecord.attendance.find(
              (a) => a.userId.toString() === member._id
            );
            updatedAttendance[member._id] = {
              present: record?.present || false,
            };
          });
          setAttendance(updatedAttendance);
        }
      } catch (err) {
        console.error(
          "RecordAttendance: Error fetching today's attendance",
          err
        );
        setError(
          err.message || "Failed to load today's attendance. Please try again."
        );
      }
    };

    fetchProject();
    if (teamMembers.length > 0) fetchTodayAttendance();
  }, [projectId, authToken, authUserId, navigate, teamMembers.length]);

  const handleAsideBarToggle = () => {
    setIsAsideBarVisible(!isAsideBarVisible);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const toggleAttendance = (userId) => {
    setAttendance((prev) => ({
      ...prev,
      [userId]: { present: !prev[userId].present },
    }));
  };

  const handleRecordAttendance = async () => {
    if (Object.values(attendance).every((status) => !status.present)) {
      setError("Please mark at least one team member as present.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const attendanceData = Object.entries(attendance).map(
        ([userId, status]) => ({
          userId,
          present: status.present,
        })
      );
      console.log("RecordAttendance: Submitting attendance", {
        projectId,
        date: today,
        attendance: attendanceData,
      });
      const res = await fetch("/att/auth/projects/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          projectId,
          date: today,
          attendance: attendanceData,
        }),
      });
      if (!res.ok) {
        const errorData = await res.text(); // Use text() to capture raw response
        console.error(
          "RecordAttendance: Save attendance error response",
          errorData
        );
        throw new Error(
          `HTTP error! status: ${res.status}, response: ${errorData}`
        );
      }
      const data = await res.json();
      console.log("RecordAttendance: Attendance recorded", data);
      setShowConfirmModal(false);
      alert(
        `Attendance recorded for ${
          attendanceData.filter((a) => a.present).length
        } team members on ${formatDate(today)}`
      );
      navigate(-1);
    } catch (err) {
      console.error("RecordAttendance: Error recording attendance", err);
      setError(err.message || "Failed to record attendance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter(
    (status) => status.present
  ).length;
  const attendanceRate =
    teamMembers.length > 0
      ? Math.round((presentCount / teamMembers.length) * 100)
      : 0;

  return (
    <>
      <AsideBar
        isAsideBarVisible={isAsideBarVisible}
        handleAsideBarToggle={handleAsideBarToggle}
      />
      <div className="record-attendance">
        {isLoading && (
          <div className="record-loading-overlay">
            <div className="record-spinner"></div>
          </div>
        )}
        {showConfirmModal && (
          <div className="record-modal">
            <div className="record-modal-content">
              <h3>Confirm Attendance</h3>
              <p>
                Record attendance for {presentCount} of {teamMembers.length}{" "}
                team members as present on {formatDate(today)}?
              </p>
              <div className="record-modal-actions">
                <button
                  className="record-button record-button-cancel"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="record-button"
                  onClick={handleRecordAttendance}
                  disabled={isLoading}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="recordattendance-header">
          <div className="recordheader-content">
            <h1>Record Attendance</h1>
            <div className="recordproject-period">
              <strong>{project?.name || "Loading..."}</strong>
              <p>
                {project
                  ? `${formatDate(project.startDate)} - ${formatDate(
                      project.endDate
                    )}`
                  : "Loading..."}
              </p>
              <p>
                Recording attendance for <strong>{formatDate(today)}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="recordattendance-content">
          <div className="recordmain-section">
            <div className="recordmark-attendance-card">
              <div className="recordsection-header">
                <h2>Mark Attendance for {formatDate(today)}</h2>
              </div>
              {error && <div className="recorderror-message">{error}</div>}
              {teamMembers.length === 0 ? (
                <div className="recordempty-state">
                  <User size={24} />
                  <p>No team members assigned to this project.</p>
                </div>
              ) : (
                <div className="recordattendance-list">
                  {teamMembers.map((member) => (
                    <div key={member._id} className="recordattendance-item">
                      <div className="recordemployee-info">
                        <div className="recordemployee-name">{member.name}</div>
                        <div className="recordemployee-id">
                          {member.empId} • {member.department}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={attendance[member._id]?.present || false}
                        onChange={() => toggleAttendance(member._id)}
                        className="record-checkbox"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="recordsummary-card">
              <div className="recordsection-header">
                <h2>Today's Summary</h2>
              </div>
              <div className="recordsummary-stats">
                <div className="recordstat-item">
                  <div className="recordstat-label">Team Size</div>
                  <div className="recordstat-value">{teamMembers.length}</div>
                </div>
                <div className="recordstat-item">
                  <div className="recordstat-label">Attendance Rate</div>
                  <div className="recordstat-value">{attendanceRate}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="recordsidebar-section">
            <div className="recordteam-overview-card">
              <div className="recordsection-header">
                <h2>Team Overview</h2>
              </div>
              <div className="recordteam-list">
                {teamMembers.map((member) => (
                  <div key={member._id} className="recordteam-member-item">
                    <div className="projectmember-name">
                      <User size={16} />
                      {member.name}
                    </div>
                    <div className="projectmember-id">{member.empId}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {teamMembers.length > 0 && (
          <div className="recordfloating-action">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="record-button"
              disabled={isLoading}
            >
              <CheckCircle size={20} />
              Record {presentCount} Attendance{presentCount !== 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RecordAttendance;
