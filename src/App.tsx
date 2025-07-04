import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './Contexts/ThemeContext';
import { ProtectedRoute, PublicRoute } from './utils/ProtectedRoutes';
import LandingPage from './Pages/Landing/Landing';
import { OnboardingFlow } from './Pages/Onboarding/OnboardingFlow';
import IndividualLogin from './Pages/Auth/IndividualLogin';
import IndividualRegister from './Pages/Auth/IndividualRegister';
import CompanyLogin from './Pages/Auth/CompanyLogin';
import CompanyRegister from './Pages/Auth/CompanyRegister';
import ProfilePage from './Pages/Profile/Profile';
import { DashboardShell } from './Pages/Dashboard/DashboardShell';
import { DynamicJobMatching } from './Pages/Dashboard/DynamicJobMatching';
import ApplicationsPage from './Pages/Applications/ApplicationPage';
import SettingsPage from './Pages/Settings/SettingsPage';
import { JobsPostPage } from './Pages/Company/JobPost/JobPostPage';
import { CompanyDashboardShell } from './Pages/Company/Dashboard/CompanyDashboardShell';
import CompanyApplicationsPage from './Pages/Company/JobPost/ApplicationsPage';
import AvailabilityPage from './Pages/Company/JobPost/AvailabilityPage';
import ForgotPassword from './Pages/Auth/ForgetPassword';
import IndividualResetPassword from './Pages/Auth/IndividualResetPassword';
import CompanyProfile from './Pages/Company/ProfilePage/CompanyProfile';
import JobPostForm from './Pages/Company/JobPost/JobPostForm';
import { GoogleAuthCallback } from './components/Others/GoogleAuthCallback';
import { Toaster } from 'sonner';
import ContactUsPage from './Pages/Contact/ContactUsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/individual-login" element={<IndividualLogin />} />
            <Route path="/individual-register" element={<IndividualRegister />} />
            <Route path="/individual-forget-password" element={<IndividualResetPassword />} />
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/company/register" element={<CompanyRegister />} />
            <Route path="/company/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding/*" element={<OnboardingFlow />} />
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            <Route path="/contact" element={<ContactUsPage />} />
          </Route>

          {/* Protected Individual Routes */}
          <Route element={<ProtectedRoute allowedUserType="individual" />}>
            <Route path="/dashboard/profile" element={<DashboardShell><ProfilePage /></DashboardShell>} />
            <Route path="/dashboard/interactive" element={<DashboardShell><DynamicJobMatching /></DashboardShell>} />
            <Route path="/dashboard/applications" element={<DashboardShell><ApplicationsPage /></DashboardShell>} />
            <Route path="/dashboard/settings" element={<DashboardShell><SettingsPage /></DashboardShell>} />
          </Route>

          {/* Protected Company Routes */}
          <Route element={<ProtectedRoute allowedUserType="company" />}>
            <Route path="/company/dashboard/profile" element={<CompanyDashboardShell><CompanyProfile /></CompanyDashboardShell>} />
            <Route path="/company/dashboard/jobposts" element={<CompanyDashboardShell><JobsPostPage /></CompanyDashboardShell>} />
            <Route path="/company/dashboard/job/new" element={<CompanyDashboardShell><JobPostForm /></CompanyDashboardShell>} />
            <Route path="/company/dashboard/job/:jobId" element={<CompanyDashboardShell><JobPostForm /></CompanyDashboardShell>} />
            <Route path="/company/dashboard/:jobId/applications" element={<CompanyDashboardShell><CompanyApplicationsPage /></CompanyDashboardShell>} />
            <Route path="/company/dashboard/availability" element={<CompanyDashboardShell><AvailabilityPage /></CompanyDashboardShell>} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
