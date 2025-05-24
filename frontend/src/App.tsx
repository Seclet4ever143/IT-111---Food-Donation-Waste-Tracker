import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

// Layouts
import AdminLayout from "./components/layouts/AdminLayout"
import DonorLayout from "./components/layouts/DonorLayout"
import CharityLayout from "./components/layouts/CharityLayout"

// Public pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Profile from "./pages/Profile"

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard"
import ManageUsers from "./pages/admin/ManageUsers"
import AdminDonations from "./pages/admin/AdminDonations"
import AdminReports from "./pages/admin/AdminReports"

// Donor pages
import DonorDashboard from "./pages/donor/DonorDashboard"
import AddDonation from "./pages/donor/AddDonation"
import MyDonations from "./pages/donor/MyDonations"
import TrackWaste from "./pages/donor/TrackWaste"

// Charity pages
import CharityDashboard from "./pages/charity/CharityDashboard"
import AvailableDonations from "./pages/charity/AvailableDonations"
import ClaimedDonations from "./pages/charity/ClaimedDonations"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Donor routes */}
          <Route
            path="/donor"
            element={
              <ProtectedRoute allowedRoles={["donor"]}>
                <DonorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DonorDashboard />} />
            <Route path="add-donation" element={<AddDonation />} />
            <Route path="my-donations" element={<MyDonations />} />
            <Route path="track-waste" element={<TrackWaste />} />
            <Route path="profile" element={<Profile />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Charity routes */}
          <Route
            path="/charity"
            element={
              <ProtectedRoute allowedRoles={["charity"]}>
                <CharityLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CharityDashboard />} />
            <Route path="available-donations" element={<AvailableDonations />} />
            <Route path="claimed-donations" element={<ClaimedDonations />} />
            <Route path="profile" element={<Profile />} />
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
