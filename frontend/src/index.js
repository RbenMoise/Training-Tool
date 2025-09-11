import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/home/Home";
import Introduction from "./components/introduction/Introduction";
import About from "./components/about/About";
import Courses from "./components/courses/Courses";
import Teachers from "./components/teachers/Teachers";
import Contact from "./components/contact/Contact";
import Landing from "./components/landing/Landing";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import QuizList from "./components/quizlist/Quizlist";
import Under from "./components/underconstruction/Under";
import Profile from "./components/profilepage/ProfilePage";
import { UserProvider } from "./contexts/UserContext";
import { LogoutProvider } from "./contexts/LogoutContext";
import PrivateRoute from "./components/PrivateRoute";

// for the components2
import Home_Attendance from "./components2/home_Attendance/Home_Attendance";
import CreateProjectForm from "./components2/createprojectform/CreateProjectForm";
import TeamSelection from "./components2/teamselection/TeamSelection";
import ProjectDashboard from "./components2/projectdashboard/ProjectDashboard";
import RecordAttendance from "./components2/recordattendance/RecordAttendance";
import SignUp from "./components2/signup/SignUp";
import SignIn from "./components2/signin/SignIn";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3100);
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
        <LogoutProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/homeAttendance" element={<Home_Attendance />} />
              <Route path="/createprojectform" element={<CreateProjectForm />} />
               <Route path="/teamselection" element={<TeamSelection />} />
               <Route path="/projectdashboard" element={<ProjectDashboard />} />
                <Route path="/recordattendance" element={<RecordAttendance />} />
                 <Route path="/signup" element={<SignUp />} />
                   <Route path="/signin" element={<SignIn />} />
              





            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Landing />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/introduction"
              element={
                <PrivateRoute>
                  <Introduction />
                </PrivateRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <About />
                </PrivateRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <PrivateRoute>
                  <Courses />
                </PrivateRoute>
              }
            />
            <Route
              path="/teachers"
              element={
                <PrivateRoute>
                  <Teachers />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <Contact />
                </PrivateRoute>
              }
            />
            <Route
              path="/quizlist"
              element={
                <PrivateRoute>
                  <QuizList />
                </PrivateRoute>
              }
            />
            <Route path="/under" element={<Under />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </LogoutProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

Modal.setAppElement("#root");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
