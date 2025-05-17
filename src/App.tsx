import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApplicationContextProvider } from './context/ApplicationContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import DonatePage from './pages/DonatePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import ApplicationDetailsPage from './pages/ApplicationDetailsPage';
import ApplicationEditPage from './pages/ApplicationEditPage';

function App() {
  useEffect(() => {
    // Initialize dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add('light');
    }
  }, []);

  return (
    <ThemeProvider>
      <ApplicationContextProvider>
        <Router basename={process.env.NODE_ENV === 'production' ? '/NextStepTracker' : ''}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="/applications/:id/edit" element={<ApplicationEditPage />} />
          </Routes>
        </Router>
      </ApplicationContextProvider>
    </ThemeProvider>
  );
}

export default App;