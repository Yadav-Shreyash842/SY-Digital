import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'
import ClientLayout from './layouts/ClientLayout'
import HomePage from './pages/HomePage'
import ContactPage from './pages/public/ContactPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import AdminBlogsPage from './pages/admin/AdminBlogsPage'
import AdminMediaPage from './pages/admin/AdminMediaPage'
import AdminMeetingsPage from './pages/admin/AdminMeetingsPage'
import AdminMessagesPage from './pages/admin/AdminMessagesPage'
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage'
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage'
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage'
import AdminProfilePage from './pages/admin/AdminProfilePage'
import AdminProjectsPage from './pages/admin/AdminProjectsPage'
import AdminReviewsPage from './pages/admin/AdminReviewsPage'
import AdminRolesPage from './pages/admin/AdminRolesPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientProjectsPage from './pages/client/ClientProjectsPage'
import ClientMeetingsPage from './pages/client/ClientMeetingsPage'
import ClientInvoicesPage from './pages/client/ClientInvoicesPage'
import MessagesPage from './pages/client/MessagesPage'
import ClientFeaturePage from './pages/client/ClientFeaturePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

function PlaceholderPage({ title, subtitle = 'This section is coming soon.' }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle ? <p className="mt-2 text-slate-400">{subtitle}</p> : null}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

      <Route element={<ProtectedRoute />}>
  <Route element={<RoleRoute allowedRoles={['admin']} />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="analytics" element={<AdminAnalyticsPage />} />
      <Route path="services" element={<AdminServicesPage />} />
      <Route path="projects" element={<AdminProjectsPage />} />
      <Route path="portfolio" element={<AdminPortfolioPage />} />
      <Route path="notifications" element={<AdminNotificationsPage />} />
      <Route path="settings" element={<AdminSettingsPage />} />
      <Route path="profile" element={<AdminProfilePage />} />
      <Route path="messages" element={<AdminMessagesPage />} />
      <Route path="meetings" element={<AdminMeetingsPage />} />
      <Route path="payments" element={<AdminPaymentsPage />} />
      <Route path="media" element={<AdminMediaPage />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="roles" element={<AdminRolesPage />} />
      <Route path="blogs" element={<AdminBlogsPage />} />
      <Route path="reviews" element={<AdminReviewsPage />} />
    </Route>
  </Route>
</Route>

       <Route element={<ProtectedRoute />}>
  <Route element={<RoleRoute allowedRoles={['client']} />}>
    <Route path="/client" element={<ClientLayout />}>
      <Route index element={<ClientDashboard />} />
      <Route path="projects" element={<ClientProjectsPage />} />
      <Route path="meetings" element={<ClientMeetingsPage />} />
      <Route path="invoices" element={<ClientInvoicesPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route
        path="profile"
        element={
          <ClientFeaturePage
            variant="profile"
            title="Profile"
            subtitle="Update your contact, company, and notification preferences."
          />
        }
      />
      <Route
        path="settings"
        element={
          <ClientFeaturePage
            variant="settings"
            title="Settings"
            subtitle="Customize your portal experience and connection preferences."
          />
        }
      />
    </Route>
  </Route>
</Route>
      </Routes>
    </BrowserRouter>
  )
}
