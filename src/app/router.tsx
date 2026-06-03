import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '../components/layout/PublicLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { AdminLayout } from '../components/layout/AdminLayout'
import { AuthGuard } from '../components/auth/AuthGuard'
import { AdminGuard } from '../components/auth/AdminGuard'

// Public pages
import { HomePage } from '../pages/public/HomePage'
import { HowItWorksPage } from '../pages/public/HowItWorksPage'
import { LawEnforcementPage } from '../pages/public/LawEnforcementPage'
import { FamilyProtectionPage } from '../pages/public/FamilyProtectionPage'
import { PricingPage } from '../pages/public/PricingPage'
import { FAQPage } from '../pages/public/FAQPage'
import { SecurityPage } from '../pages/public/SecurityPage'
import { PrivacyPage } from '../pages/public/PrivacyPage'
import { TermsPage } from '../pages/public/TermsPage'
import { ContactPage } from '../pages/public/ContactPage'

// Auth pages
import { LoginPage } from '../pages/auth/LoginPage'
import { SignupPage } from '../pages/auth/SignupPage'

// Dashboard pages
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { ConsentPage } from '../pages/dashboard/ConsentPage'
import { IntakePage } from '../pages/dashboard/IntakePage'
import { BrokersPage } from '../pages/dashboard/BrokersPage'
import { BrokerDetailPage } from '../pages/dashboard/BrokerDetailPage'
import { ReportsPage } from '../pages/dashboard/ReportsPage'
import { SettingsPage } from '../pages/dashboard/SettingsPage'
import { DeleteRequestPage } from '../pages/dashboard/DeleteRequestPage'

// Admin pages
import { AdminHomePage } from '../pages/admin/AdminHomePage'
import { AdminBrokersPage } from '../pages/admin/AdminBrokersPage'
import { AdminTasksPage } from '../pages/admin/AdminTasksPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'
import { AdminReportsPage } from '../pages/admin/AdminReportsPage'

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/law-enforcement" element={<LawEnforcementPage />} />
          <Route path="/family-protection" element={<FamilyProtectionPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected dashboard */}
        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/consent" element={<ConsentPage />} />
          <Route path="/dashboard/intake" element={<IntakePage />} />
          <Route path="/dashboard/brokers" element={<BrokersPage />} />
          <Route path="/dashboard/brokers/:id" element={<BrokerDetailPage />} />
          <Route path="/dashboard/reports" element={<ReportsPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/delete-request" element={<DeleteRequestPage />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route path="/admin" element={<AdminHomePage />} />
          <Route path="/admin/brokers" element={<AdminBrokersPage />} />
          <Route path="/admin/tasks" element={<AdminTasksPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
