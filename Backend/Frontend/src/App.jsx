/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/User/Home";
import Signup from "./pages/User/SignUp";
import Login from "./pages/User/Login";
import Dashboard from "./pages/User/Dashboard";
import AdminSignup from "./pages/Admin/AdminSignup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PropTypes from "prop-types";
import AdminLogin from "./pages/Admin/AdminLogin";
import UploadComponent from "./component/UploadComponent";
import Gallery from "./component/Gallery";
import Templates from "./pages/User/Templates";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import HtmlEditor from "./component/HtmlEditor";
import Editor from "./component/Editor";
import SavedTemplates from "./pages/SavedTemplates";
import AddBlogForm from "./pages/User/AddBlogs";
import MyBlogs from "./pages/User/MyBlogs";
import AdminAddBlog from "./pages/Admin/AdminAddBlog";
import Blogs from "./component/Blogs";
import BlogDetail from "./component/BlogDetail";
import AdminBlogDetail from "./component/AdminBlogDetail";
import AboutUs from "./pages/User/AboutUs";

// Protected Route for general user
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");

  if (admin) {
    return <Navigate to="/AdminDashboard" replace />;
  }

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Admin Protected Route
const AdminProtectedRoute = ({ children }) => {
  const admin = localStorage.getItem("admin");
  const user = localStorage.getItem("user");

  if (user) {
    return <Navigate to="/Dashboard" replace />;
  }

  if (!admin) {
    return <Navigate to="/AdminLogin" replace />;
  }

  return children;
};

AdminProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// User Protected Route based on userType
const UserProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.userType !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

UserProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// AuthRoute for handling general authentication
const AuthRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");

  if (user || admin) {
    return <Navigate to={user ? "/Dashboard" : "/AdminDashboard"} replace />;
  }

  return children;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// AdminAuthRoute for handling admin authentication
const AdminAuthRoute = ({ children }) => {
  const admin = localStorage.getItem("admin");
  const user = localStorage.getItem("user");

  if (admin || user) {
    return <Navigate to={admin ? "/AdminDashboard" : "/Dashboard"} replace />;
  }

  return children;
};

AdminAuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <div className="bg-black h-full w-full">
      <DndProvider backend={HTML5Backend}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path="/admin/blog/:permalink" element={<AdminBlogDetail/>} />
          <Route path="/blog/:slug" element={<BlogDetail/>} />
          <Route path="/AboutUs" element={<AboutUs/>} />

        



          {/* Public Blog Detail Route */}
          {/* <Route path="/BlogDetail/:id" element={< />} /> */}
          <Route
            path="/Login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/Signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminLogin"
            element={
              <AdminAuthRoute>
                <AdminLogin />
              </AdminAuthRoute>
            }
          />
          <Route
            path="/AdminSignup"
            element={
              <AdminAuthRoute>
                <AdminSignup />
              </AdminAuthRoute>
            }
          />
          <Route
            path="/AdminDashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/Upload"
            element={
              <AdminProtectedRoute>
                <UploadComponent />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/Gallery"
            element={
              <AdminProtectedRoute>
                <Gallery />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/AddBlogPost"
            element={
              <AdminProtectedRoute>
                <AdminAddBlog />
              </AdminProtectedRoute>
            }
          />
          {/* <Route
            path="/BlogDetail/:id"
            element={
              <AdminProtectedRoute>
                <BlogDetail />
              </AdminProtectedRoute>
            }
          /> */}

          {/* User-Specific Routes */}
          <Route
            path="/Templates"
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/HtmlEditor"
            element={
              <ProtectedRoute>
                <HtmlEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Editor"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SavedTemplates"
            element={
              <ProtectedRoute>
                <SavedTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddBlog"
            element={
              <ProtectedRoute>
                <AddBlogForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MyBlogs"
            element={
              <ProtectedRoute>
                <MyBlogs />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/BlogDetail/:id"
            element={
              <ProtectedRoute>
                <BlogDetail />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </DndProvider>
    </div>
  );
}

export default App;
