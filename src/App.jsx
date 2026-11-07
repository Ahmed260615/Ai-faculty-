import { lazy, Suspense } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import EmptyState from './components/ui/EmptyState';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Radiation = lazy(() => import('./pages/radiation/RadiationPage'));
const EmergencyTests = lazy(() => import('./pages/emergency/EmergencyTests'));
const EmergencyVideos = lazy(() => import('./pages/emergency/EmergencyVideos'));
const Schedule = lazy(() => import('./pages/psychological/Schedule'));
const Phq9 = lazy(() => import('./pages/psychological/PsychAssessment'));
const Puzzles = lazy(() => import('./pages/psychological/Puzzles'));
const GravityAssessment = lazy(() => import('./pages/gravity/GravityAssessment'));
const Exercises = lazy(() => import('./pages/gravity/Exercises'));
const Nutrition = lazy(() => import('./pages/nutrition/NutritionPage'));
const Respiration = lazy(() => import('./pages/nutrition/RespirationPage'));
const Reports = lazy(() => import('./pages/Reports'));
const ReportDetail = lazy(() => import('./pages/ReportDetail'));

export default function App() {
  return (
    <Suspense fallback={<p role="status" className="p-10 text-center text-lg text-muted">Loading…</p>}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="radiation" element={<Radiation />} />
          <Route path="emergency" element={<EmergencyTests />} />
          <Route path="emergency/videos" element={<EmergencyVideos />} />
          <Route path="psychological" element={<Schedule />} />
          <Route path="psychological/assessment" element={<Phq9 />} />
          <Route path="psychological/puzzles" element={<Puzzles />} />
          <Route path="gravity" element={<GravityAssessment />} />
          <Route path="gravity/exercises" element={<Exercises />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="nutrition/respiration" element={<Respiration />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetail />} />
          <Route path="*" element={<EmptyState title="Page not found"><Link className="btn-primary mt-3" to="/">Back to dashboard</Link></EmptyState>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
