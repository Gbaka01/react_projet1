// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");

  // 🔒 Pas de token → redirection login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role || decoded.userRole; // selon ton JWT

    // ✅ Si le rôle fait partie des autorisés → accès OK
    if (allowedRoles.includes(userRole)) {
      return children;
    }

    // ❌ Sinon redirection page d'accueil
    return <Navigate to="/" replace />;
  } catch (error) {
    console.error("Erreur décodage token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}

