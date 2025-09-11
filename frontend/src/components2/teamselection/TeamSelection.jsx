import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import './TeamSelection.css';

const TeamSelection = () => {
  const navigate = useNavigate();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);
   const handleAsideBarToggle = () => {
    setIsAsideBarVisible(!isAsideBarVisible);
  };





  // Sample team members data
  const teamMembers = [
    { id: 1, name: 'Lemiso Koiyo', empId: 'EMP675', department: 'Engineering' },
    { id: 2, name: 'Kathleen Asena', empId: 'EMP712', department: 'Geophysics' },
    { id: 3, name: 'Lucy Obwongo', empId: 'EMP813', department: 'Engineering' },
    { id: 4, name: 'Clara Orora', empId: 'EMP674', department: 'Geochemistry' },
    { id: 5, name: 'Vanila Mwangi', empId: 'EMP1015', department: 'Geology' },
    { id: 6, name: 'Sharon Rotich', empId: 'EMP916', department: 'Data Management' },
  ];

  const departments = ['All Departments', 'Geophysics', 'Engineering', 'Geology', 'Data Management'];

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => {
      const isSelected = prev.includes(memberId);
      if (isSelected) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || 
                             member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleCreateProject = () => {
    // Handle project creation with selected team
    console.log('Creating project with team:', selectedMembers);
    window.scrollTo(0, 0);
    navigate('/projectdashboard');
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    navigate(-1);
  };








  return (

    <>
 <AsideBar isAsideBarVisible={isAsideBarVisible} handleAsideBarToggle={handleAsideBarToggle} />

    <div className="team-selection-page">
      <div className="page-headerteam">
        <h1>Select Team</h1>
        <div className="project-info">
          <h2>Tinga</h2>
          <p className="date-range">9/9/2025 - 9/13/2025</p>
          <p className="project-description">Tinga field description goes here</p>
        </div>
      </div>

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
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="team-section">
            
            <div className="members-grid">
              {filteredMembers.map(member => (
                <div 
                  key={member.id} 
                  className={`member-card ${selectedMembers.includes(member.id) ? 'selected' : ''}`}
                  onClick={() => toggleMemberSelection(member.id)}
                >
                  <div className="member-details">
                    <h4>{member.name}</h4>
                    <p>{member.empId} - {member.department}</p>
                  </div>
                  <div className="member-action">
                    {selectedMembers.includes(member.id) ? (
                      <i className="fas fa-check-circle selected-icon"></i>
                    ) : (
                      <button className="add-button">+ Add</button>
                    )}
                  </div>
                </div>
              ))}
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
              {teamMembers
                .filter(member => selectedMembers.includes(member.id))
                .map(member => (
                  <div key={member.id} className="selected-item">
                    <div className="selected-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-details">{member.department}</span>
                    </div>
                    <button 
                      onClick={() => toggleMemberSelection(member.id)}
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
          disabled={selectedMembers.length === 0}
        >
          Create Project
        </button>
      </div>
    </div>
    </>
  );
};

export default TeamSelection;