import { useEffect } from "react";
import { AppRouter } from "./app/router";
import { useAuthStore } from "@/features/auth/store";

export default function App() {
  const refreshSession = useAuthStore((s) => s.refreshSession);

  useEffect(() => {
    refreshSession();
  }, []);

  return <AppRouter />;
}