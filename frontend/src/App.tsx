import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import TelemedicinePage from './pages/TelemedicinePage';
import HospitalManagementPage from './pages/HospitalManagementPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DoctorPanel from './pages/DoctorPanel';
import Preloader from './components/common/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/telemedicine" element={<TelemedicinePage />} />
                <Route path="/hospital-management" element={<HospitalManagementPage />} />
                <Route path="/doctor-panel" element={<DoctorPanel />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;