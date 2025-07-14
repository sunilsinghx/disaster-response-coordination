// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./components/Login";
import Dashboard from "./components/Dashboard";
import PageLayout from "./components/Layout/PageLayout";
import Navbar from "./components/Layout/Navbar";
import { Disaster } from "./components/Disaster/Disaster";
import ProtectedRoute from "./components/Layout/PageLayout";
import { Report } from "./components/Report/Report";

function App() {
  const { currentUser, selectedDisaster } = useAuth();

  return (
    <Router>
      {currentUser && <Navbar />}

      <Routes>
        {/* Public route: Login */}
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <div className="flex h-screen bg-gray-500 justify-center items-center">
                <LoginPage />
              </div>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageLayout title="Disaster Response">
                <Dashboard />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:id"
          element={
            <ProtectedRoute>
              <PageLayout title="Disaster Details">
                <Disaster selectedDisaster={selectedDisaster} />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:id/report"
          element={
            <ProtectedRoute>
              <PageLayout title="Report">
                <Report selectedDisaster={selectedDisaster} />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
