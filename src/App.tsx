/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Therapy from './pages/Therapy';
import Community from './pages/Community';
import SimbieAI from './pages/SimbieAI';
import Profile from './pages/Profile';
import Guide from './pages/Guide';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const OnboardingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { onboardingCompleted, loading, user } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Cargando...</div>;

  if (user && !onboardingCompleted) {
    return <Onboarding />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <AuthWrapper>
                  <OnboardingWrapper>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/home" replace />} />
                        <Route path="home" element={<Home />} />
                        <Route path="therapy" element={<Therapy />} />
                        <Route path="community" element={<Community />} />
                        <Route path="simbie" element={<SimbieAI />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="guide" element={<Guide />} />
                      </Route>
                      <Route path="onboarding" element={<Onboarding />} />
                    </Routes>
                  </OnboardingWrapper>
                </AuthWrapper>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
