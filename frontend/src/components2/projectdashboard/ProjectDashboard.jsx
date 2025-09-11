import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, FileText, User, ChevronRight, BarChart3, Clock } from 'lucide-react';
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import './ProjectDashboard.css';

const ProjectDashboard = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);


  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);




  const handleAsideBarToggle = () => {
    setIsAsideBarVisible(!isAsideBarVisible);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const teamMembers = [
    { id: 1, name: 'Lorna Sapit', empId: 'EMP011', department: 'Geochemistry', attendance: 0, daysPresent: 0 },
    { id: 2, name: 'Helen Sonkoi', empId: 'EMP010', department: 'Geophysics', attendance: 0, daysPresent: 0 },
    { id: 3, name: 'Lemiso Koiyo', empId: 'EMP012', department: 'Engineering', attendance: 0, daysPresent: 0 },
    { id: 4, name: 'James Wanjiku', empId: 'EMP013', department: 'Geology', attendance: 0, daysPresent: 0 },
    { id: 5, name: 'Mary Kiprotich', empId: 'EMP014', department: 'Data Management', attendance: 0, daysPresent: 0 }
  ];

  const stats = [
    { icon: Users, label: 'Team Members', value: '5', color: '#94d500' },
    { icon: Calendar, label: 'Total Days', value: '5', color: '#e74c3c' },
    { icon: FileText, label: 'Days Recorded', value: '0', color: '#94d500' },
    { icon: BarChart3, label: 'Attendance Rate', value: '0%', color: '#e74c3c' }
  ];

  const handleRecordAttendancePage = () => {
    window.scrollTo(0, 0);
    navigate('/recordattendance');
  };

  const handleViewReports = () => {
    console.log('Viewing attendance reports');
  };






  return (
<>

 <AsideBar isAsideBarVisible={isAsideBarVisible} handleAsideBarToggle={handleAsideBarToggle} />


    <div className="dashboard-container">
      {/* Header */}
      <div className="projectheader">
        <div className="projectheader-content">
          <div className="projectheader-main">
            <div className="project-info">
              <div className="project-title-section">
                <div className="project-indicator"></div>
                <div className="project-details">
                  <h1 className="project-title">Tinga</h1>
                  <div className="project-meta">
                    <span className="status-badge">Ongoing</span>
                    <span className="project-dates">September 9, 2025 - September 13, 2025</span>
                  </div>
                </div>
              </div>
              <p className="project-description">(Tinga field description goes here)</p>
              
              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>Project Progress</span>
                  <span>33% Complete</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
            
            <div className="header-actions">
              <button onClick={handleRecordAttendancePage} className="btn-primary">
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
                  <div className="stat-icon" style={{ backgroundColor: stat.color + '20' }}>
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
                <div className="card-date">{currentTime.toLocaleDateString()}</div>
              </div>
            </div>
            <div className="card-body">
              <div className="attendance-summary">
                <span className="attendance-text">Present: 0 of 5</span>
                <span className="attendance-percentage">0%</span>
              </div>
              <div className="no-attendance">
                <Clock className="no-attendance-icon" />
                <p className="no-attendance-text">No attendance recorded for today</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="projectcard">
            <div className="card-header">
              <h2 className="card-title">Team Members</h2>
            </div>
            <div className="team-list">
              {teamMembers.map((member, index) => (
                <div 
                  key={member.id}
                  className="team-member"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="member-info">
                    <div className="member-avatar">
                      <User size={16} />
                    </div>
                    <div className="member-details">
                      <div className="projectmember-name">{member.name}</div>
                      <div className="member-meta">{member.empId} • {member.department}</div>
                    </div>
                  </div>
                  <div className="member-stats">
                    <div className="member-attendance">
                      <div className="attendance-rate">{member.attendance}%</div>
                      <div className="days-count">{member.daysPresent} days</div>
                    </div>
                    <ChevronRight size={16} className="chevron-icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <button onClick={handleRecordAttendancePage} className="action-card">
              <div className="action-content">
                <div className="action-header">
                  <div className="action-icon green">
                    <Users size={20} />
                  </div>
                  <h3 className="action-title">Record Daily Attendance</h3>
                </div>
                <p className="action-description">Mark team members as present for today</p>
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
                <p className="action-description">Generate and print attendance summaries</p>
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