import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Applications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import MyApplications from "./pages/MyApplications";

import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageCompanies from "./pages/ManageCompanies";
import Reports from "./pages/Reports";
import PendingRecruiters from "./pages/PendingRecruiters";
import ReviewJobs from "./pages/ReviewJobs";

import HirerDashboard from "./pages/HirerDashboard";
import CreateJob from "./pages/CreateJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplicants from "./pages/ViewApplicants";

import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        {/* USER ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["USER"]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute
              allowedRoles={["USER"]}
            >
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-resume"
          element={
            <ProtectedRoute
              allowedRoles={["USER"]}
            >
              <ResumeUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute
              allowedRoles={["USER"]}
            >
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* RECRUITER ROUTES */}
        <Route
          path="/hirer-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "HIRING_DEPARTMENT",
              ]}
            >
              <HirerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <ProtectedRoute
              allowedRoles={[
                "HIRING_DEPARTMENT",
              ]}
            >
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-jobs"
          element={
            <ProtectedRoute
              allowedRoles={["HIRING_DEPARTMENT", "ADMIN"]}
            >
              <ManageJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-applicants"
          element={
            <ProtectedRoute
              allowedRoles={["HIRING_DEPARTMENT", "ADMIN"]}
            >
              <ViewApplicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-applicants/:jobId"
          element={
            <ProtectedRoute
              allowedRoles={["HIRING_DEPARTMENT", "ADMIN"]}
            >
              <ViewApplicants />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-companies"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <ManageCompanies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pending-recruiters"
          element={
            <ProtectedRoute
              allowedRoles={["ADMIN"]}
            >
              <PendingRecruiters />
            </ProtectedRoute>
          }
        />

        <Route
          path="/review-jobs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ReviewJobs />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;