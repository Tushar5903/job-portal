import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import NavBar from "./components/NavBar.jsx";
import Chatbot from "./components/Chatbot.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CandidatePage from "./pages/CandidatePage.jsx";
import EmployerPage from "./pages/EmployerPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <NavBar />
          <main className="page-wrapper">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute roles={["candidate"]}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate"
                element={
                  <ProtectedRoute roles={["candidate"]}>
                    <CandidatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer"
                element={
                  <ProtectedRoute roles={["employer"]}>
                    <EmployerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
