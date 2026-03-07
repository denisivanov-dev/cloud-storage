import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}