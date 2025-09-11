import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/nock j.png";
import { UserContext } from "../../contexts/UserContext";
import "./AttendanceSidebar.css";
import axios from "axios";
import { MdEdit } from "react-icons/md";

const AttendanceSidebar = ({ isAsideBarVisible, handleAsideBarToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const { user, setUser } = useContext(UserContext); // Get the user context

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload and save to backend
  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file); // Append image file
    formData.append("email", user.email); // Append user email

    try {
      const response = await axios.post("/upload-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "success") {
        // Update the user object with the new image URL from the backend
        setUser({ ...user, imageUrl: response.data.imageUrl });
        setIsEditing(false); // Stop editing mode
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  // Determine the image URL: either from MongoDB or the default profile image
  const imageUrl = user?.imageUrl ? `/profile-image/${user.email}` : Logo;

  return (
    <div className={`attendanceSidebar ${isAsideBarVisible ? "visible" : ""}`}>
      <div id="close-btn" onClick={handleAsideBarToggle}>
        <i className="fas fa-times"></i>
      </div>
      <div className="profile">
        {/* Display the profile image */}
        <img src={imageUrl} className="image" alt="Logo" />
        {isEditing ? (
          <div className="file-upload-widget">
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="button-group">
              <button onClick={handleFileUpload} className="upload-button">
                Upload
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Edit button to trigger image editing/upload
          <button onClick={() => setIsEditing(true)} className="edit-button">
            <MdEdit />
          </button>
        )}
        {/* Display the user's name or 'Guest' if no user data */}
        <h3 className="name">{user ? user.name : "Team Lead"}</h3>
        <Link to="/profile" className="btn">
          Profile
        </Link>
      </div>
      <nav className="navbar">
        <Link to="/home">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        <Link to="/about">
          <i className="fas fa-question"></i>
          <span>About</span>
        </Link>
        <Link to="/courses">
          <i className="fas fa-people-carry"></i>
          <span>Teams</span>
        </Link>
        <Link to="/teachers">
          <i className="fas fa-images"></i>
          <span>Gallery</span>
        </Link>
        <Link to="/contact">
          <i className="fas fa-headset"></i>
          <span>Support</span>
        </Link>
      </nav>
    </div>
  );
};

export default AttendanceSidebar;
