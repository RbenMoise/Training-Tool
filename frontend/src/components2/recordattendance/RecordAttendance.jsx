import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Calendar, User, Trash2, CheckCircle } from 'lucide-react';
import AsideBar from "../../components/attendanceSidebar/AttendanceSidebar";
import './RecordAttendance.css';

const RecordAttendance = () => {
  const navigate = useNavigate();
  const [isAsideBarVisible, setIsAsideBarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [staffNumber, setStaffNumber] = useState('');
  const [attendanceList, setAttendanceList] = useState([]);
  const [error, setError] = useState('');


  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sample team members data
  const teamMembers = [
    { id: 1, name: 'Lorna Sapit', empId: 'EMP011', department: 'Geochemistry' },
    { id: 2, name: 'Helen Sonkoi', empId: 'EMP010', department: 'Geophysics' },
    { id: 3, name: 'Lemiso Koiyo', empId: 'EMP012', department: 'Engineering' },
    { id: 4, name: 'Andrew Metamel', empId: 'EMP008', department: 'Geophysics' },
    { id: 5, name: 'Lucy Obwongo', empId: 'EMP014', department: 'Engineering' }
  ];

  const handleAsideBarToggle = () => {
    setIsAsideBarVisible(!isAsideBarVisible);
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleAddStaff = () => {
    setError('');
    
    if (!staffNumber.trim()) {
      setError('Please enter a staff number');
      return;
    }

    const staffId = staffNumber.trim().toUpperCase();
    const employee = teamMembers.find(member => member.empId === staffId);
    
    if (!employee) {
      setError('Staff number not found');
      return;
    }

    if (attendanceList.some(item => item.empId === staffId)) {
      setError('Staff member already added');
      return;
    }

    setAttendanceList(prev => [...prev, employee]);
    setStaffNumber('');
  };

  const handleRemoveStaff = (empId) => {
    setAttendanceList(prev => prev.filter(item => item.empId !== empId));
  };

  const handleClearAll = () => {
    setAttendanceList([]);
    setStaffNumber('');
    setError('');
  };

  const handleRecordAttendance = () => {
    if (attendanceList.length === 0) {
      setError('Please add at least one staff member');
      return;
    }

    // Here you would typically make an API call to record attendance
    console.log('Recording attendance for:', {
      date: selectedDate,
      attendees: attendanceList
    });

    // Show success message and navigate back
    alert(`Attendance recorded for ${attendanceList.length} team members`);
    navigate(-1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddStaff();
    }
  };

  return (
<>
 <AsideBar isAsideBarVisible={isAsideBarVisible} handleAsideBarToggle={handleAsideBarToggle} />


    <div className="record-attendance">
      <div className="recordattendance-header">
        <div className="recordheader-content">
          <h1>Record Attendance</h1>
          <div className="recordproject-period">
            <strong>September 9, 2025 - September 13, 2025</strong>
            
          </div>
        </div>
      </div>

      <div className="recordattendance-content">
        <div className="recordmain-section">
          <div className="recordmark-attendance-card">
            <div className="recordsection-header">
              <h2>Mark Attendance</h2>
            </div>

            <div className="recordinput-group">
              <label htmlFor="date">Select Date</label>
              <div className="recorddate-input">
                {/* <Calendar size={18} /> */}
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="recordmodern-input"
                />
              </div>
            </div>

            <div className="recordinput-group">
              <label htmlFor="staffNumber">Enter Staff Number</label>
              <div className="recordstaff-input">
                <input
                  type="text"
                  id="staffNumber"
                  value={staffNumber}
                  onChange={(e) => setStaffNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., EMP001"
                  className="recordmodern-input"
                />
                <button onClick={handleAddStaff} className="recordadd-button">
                  <Plus size={16} />
                  Add
                </button>
              </div>
              {error && <div className="recorderror-message">{error}</div>}
            </div>

            {attendanceList.length > 0 && (
              <div className="recordattendance-list-section">
                <div className="recordlist-header">
                  <h3>Adding to {formatDate(selectedDate)} ({attendanceList.length} employees)</h3>
                  <button onClick={handleClearAll} className="recordclear-button">
                    <Trash2 size={14} />
                    Clear All
                  </button>
                </div>

                <div className="recordattendance-list">
                  {attendanceList.map((employee, index) => (
                    <div key={employee.empId} className="recordattendance-item">
                      <div className="recordemployee-info">
                        <div className="recordemployee-name">{employee.name}</div>
                        <div className="recordemployee-id">{employee.empId}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveStaff(employee.empId)}
                        className="recordremove-button"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="recordsummary-card">
            <div className="recordsection-header">
              <h2>{formatDate(selectedDate)} Summary</h2>
            </div>

            <div className="recordsummary-stats">
              <div className="recordstat-item">
                <div className="recordstat-label">Team Size</div>
                <div className="recordstat-value">{teamMembers.length}</div>
              </div>
              <div className="recordstat-item">
                <div className="recordstat-label">Attendance Rate</div>
                <div className="recordstat-value">0%</div>
              </div>
            </div>

            <div className="recordalready-present">
              <h3>Already Present</h3>
              <div className="recordpresent-list">
                {/* This would show already recorded attendance for the selected date */}
                <div className="recordempty-state">
                  <CheckCircle size={24} />
                  <p>No attendance recorded yet</p>
                </div>
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
                <div key={member.empId} className="recordteam-member-item">
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

      {attendanceList.length > 0 && (
        <div className="recordfloating-action">
          <button onClick={handleRecordAttendance} className="record-button">
            <CheckCircle size={20} />
            Record {attendanceList.length} Attendance{attendanceList.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default RecordAttendance;