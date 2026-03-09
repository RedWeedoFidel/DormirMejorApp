/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Therapy from './pages/Therapy';
import Community from './pages/Community';
import SimbieAI from './pages/SimbieAI';
import Profile from './pages/Profile';
import Guide from './pages/Guide';
import { AppProvider } from './contexts/AppContext';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
