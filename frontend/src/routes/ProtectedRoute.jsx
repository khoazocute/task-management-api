import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ auth, children }) {
  const location = useLocation();

  // Neu chua co token local thi chuyen ve trang login.
  if (!auth?.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
