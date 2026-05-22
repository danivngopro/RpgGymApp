import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { AppShell } from "./components/AppShell";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ExerciseCatalogPage } from "./pages/ExerciseCatalogPage";
import { ExerciseDetailPage } from "./pages/ExerciseDetailPage";
import { RoutinesPage } from "./pages/RoutinesPage";
import { RoutineDetailPage } from "./pages/RoutineDetailPage";
import { ActiveWorkoutPage } from "./pages/ActiveWorkoutPage";
import { WorkoutSummaryPage } from "./pages/WorkoutSummaryPage";
import { ProfilePage } from "./pages/ProfilePage";
import { FriendsPage } from "./pages/FriendsPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-arena-muted">Loading arena...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <AppShell />;
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route element={<Protected />}>
          <Route index element={<DashboardPage />} />
          <Route path="/exercises" element={<ExerciseCatalogPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/:id" element={<RoutineDetailPage />} />
          <Route path="/workout/:id" element={<ActiveWorkoutPage />} />
          <Route path="/workout-summary" element={<WorkoutSummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
