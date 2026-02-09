import { Navigate, useLocation } from "react-router";
import { useAppSelector } from "./hooks";

export type UserRole = "STORE_OWNER" | "ADMIN" | "USER";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: UserRole | UserRole[];
}

export default function RouteProtector({
  children,
  requireRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];

    if (!user?.user?.role || !allowedRoles.includes(user?.user?.role as UserRole)) {
      console.warn(`User "${user?.role}" attempted to access unauthorized path: ${location.pathname}`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}