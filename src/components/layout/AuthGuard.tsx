import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { initialized, authenticated } = useAuth();
  const location = useLocation();

  if (!initialized) return <LoadingSpinner />;

  if (!authenticated)
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;

  return <>{children}</>;
}
