import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DoctorLayout } from '@/components/layout/DoctorLayout';
import { IntakeLayout } from '@/components/layout/IntakeLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Patient Surface Pages
import { HomePage } from '@/features/public/HomePage';
import { AboutPage } from '@/features/public/AboutPage';
import { IntakeWelcomePage } from '@/features/intake/IntakeWelcomePage';
import { ConsentPage } from '@/features/intake/ConsentPage';
import { InterviewPage } from '@/features/intake/InterviewPage';
import { DocumentPage } from '@/features/intake/DocumentPage';
import { ReviewPage } from '@/features/intake/ReviewPage';
import { CompletionPage } from '@/features/intake/CompletionPage';

// Doctor Workstation Pages
import { DoctorLoginPage } from '@/features/auth/DoctorLoginPage';
import { QueuePage } from '@/features/queue/QueuePage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { PatientOverviewPage } from '@/features/doctor/PatientOverviewPage';

const queryClient = new QueryClient();

export default function App() {
  const surface = import.meta.env.VITE_APP_SURFACE;
  const isDoctorSurface = surface === 'doctor';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {isDoctorSurface ? (
            /* ── DOCTOR OPD WORKSTATION SURFACE (PORT 5174) ── */
            <Routes>
              {/* Standalone Authentication */}
              <Route path="/doctor/login" element={<DoctorLoginPage />} />
              <Route path="/login" element={<Navigate to="/doctor/login" replace />} />

              {/* Protected Doctor Workstation */}
              <Route path="/doctor" element={<ProtectedRoute />}>
                <Route element={<DoctorLayout />}>
                  <Route index element={<Navigate to="/doctor/queue" replace />} />
                  <Route path="queue" element={<QueuePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="overview/:id" element={<PatientOverviewPage />} />
                  <Route path="encounters/:id" element={<PatientOverviewPage />} />
                </Route>
              </Route>

              {/* Doctor Surface Root & Catch-all: Directs to Workstation Queue */}
              <Route path="/" element={<Navigate to="/doctor/queue" replace />} />
              <Route path="*" element={<Navigate to="/doctor/queue" replace />} />
            </Routes>
          ) : (
            /* ── PATIENT PORTAL WEB SURFACE (PORT 5173) ── */
            <Routes>
              {/* Public Informational Portal */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>

              {/* Patient Intake Flow */}
              <Route path="/intake/:token" element={<IntakeLayout />}>
                <Route index element={<IntakeWelcomePage />} />
                <Route path="welcome" element={<IntakeWelcomePage />} />
                <Route path="consent" element={<ConsentPage />} />
                <Route path="interview" element={<InterviewPage />} />
                <Route path="documents" element={<DocumentPage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="completion" element={<CompletionPage />} />
                <Route path="confirmation" element={<CompletionPage />} />
              </Route>

              {/* Patient Surface Catch-all: Blocked / Redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
