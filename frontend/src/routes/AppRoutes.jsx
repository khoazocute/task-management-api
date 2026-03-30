import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPassword/ResetPasswordPage";
import TasksPage from "../pages/Tasks/TasksPage";
import HomePage from "../pages/Home/HomePage";
import LandingPage from "../pages/Landing/LandingPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes({ auth, setAuth, onLogout, userLabel }) {
  return (
    <Routes>
      <Route path="/" element={<LandingPage auth={auth} />} />
      <Route path="/login" element={<LoginPage setAuth={setAuth} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute auth={auth}>
            <HomePage auth={auth} onLogout={onLogout} userLabel={userLabel} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute auth={auth}>
            <TasksPage auth={auth} onLogout={onLogout} userLabel={userLabel} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
