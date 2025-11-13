import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token) {
    if (user.role === "Super Admin") {
      return <Navigate to="/superadmin" replace />;
    } else if (user.role === "Admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "Manager") {
      return <Navigate to="/manager" replace />;
    } else if (user.role === "Label") {
      return <Navigate to="/label" replace />;
    } else if (user.role === "Sub Label") {
      return <Navigate to="/sub-label" replace />;
    } else {
      // default redirect if role doesn't match
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;
