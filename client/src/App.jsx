import React from "react";
import { BrowseRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Student from "./components/Student";
import Recruiter from "./components/Recruiter";
import CourseDetails from "./components/CourseDetails";
import "./index.css";
import StudentProfile from "./components/StudentProfile";

// Check if user logged in
const isAuthenticated = () => !!localStorage.getItem("token");

// Get role from localStorage
const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.role || null; // "student", "admin", "recruiter"
};



// Protected Route with role checking
const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // redirect if not allowed
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route -> Home */}
        <Route path="/" element={<Home />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/student/profile" element={<StudentProfile />} />


        {/* Protected routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Recruiter />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
