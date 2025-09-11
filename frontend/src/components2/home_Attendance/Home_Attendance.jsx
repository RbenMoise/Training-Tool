import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import '../../components2/home_Attendance/Home_Attendance.css';

const Home_Attendance = () => {
  const navigate = useNavigate();
const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);

   const handleCreateProject = () => {
     window.scrollTo(0, 0);
    navigate('/createprojectform');
  };

// Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const handleAsideBarToggle = () => {
    setIsAsideBarVisible(!isAsideBarVisible);
  };


  return (
    <>
   
 <AsideBar isAsideBarVisible={isAsideBarVisible} handleAsideBarToggle={handleAsideBarToggle} />
    
    <div className="field-attendance-container">
      <div className="decoration decoration-circle"></div>
      <div className="decoration decoration-circle-2"></div>
      
      <header className="attendance-header">
        <h1>Field Attendance Tracker</h1>
        <p>Manage your field projects and track team attendance efficiently.</p>
      </header>

      <div className="features-container">
        <div className="feature-card">
          <div className="feature-icon">
             <i className="fas fa-clipboard-check"></i>
          </div>
          <h2>Field Management</h2>
          <p>Create and manage field projects with start and end dates.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h2>Team Assignment</h2>
          <p>Select team members from your employee database.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
             <i className="fas fa-chart-line"></i>
          </div>
          <h2>Daily Tracking</h2>
          <p>Record daily attendance and generate comprehensive reports.</p>
        </div>
      </div>

      <div className="get-started-section">
        <h2>Get Started</h2>
       <button className="create-project-btn" onClick={handleCreateProject}>
          + Create New Project
        </button>
        <p className="instruction-text">
          Create your first field project to get started with attendance tracking
        </p>
      </div>
    </div>
     </>
  );
};

export default Home_Attendance;