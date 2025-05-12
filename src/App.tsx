import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider } from './context/ApplicationContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import ApplicationEditPage from './pages/ApplicationEditPage';
import DonatePage from './pages/DonatePage';
import DonateSuccessPage from './pages/DonateSuccessPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <AuthProvider>
      <ApplicationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="/applications/:id/edit" element={<ApplicationEditPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/donate/success" element={<DonateSuccessPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Router>
      </ApplicationProvider>
    </AuthProvider>
  );
}

export default App;