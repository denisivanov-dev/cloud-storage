import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import FoldersPage from "@/pages/dashboard/FoldersPage";

import PublicRoute from "@/features/auth/components/PublicRoute";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

import LeftSidebarLayout from "@/app/layouts/LeftSidebarLayout";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* redirect */}
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />

        {/* auth */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* dashboard layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LeftSidebarLayout />
            </ProtectedRoute>
          }
        >

          {/* redirect */}
          <Route index element={<Navigate to="folders" replace />} />

          <Route path="folders" element={<FoldersPage />} />
          <Route path="folders/:id" element={<FoldersPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}