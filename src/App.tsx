import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { initWxSDK } from './lib/wechat';
import { BottomNav } from './components/BottomNav';
import { AuthGuard } from './components/AuthGuard';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { DigitalHumanPage } from './pages/DigitalHumanPage';
import { CreateDigitalHumanPage } from './pages/digital-human/CreateDigitalHumanPage';
import { CreateCloneMobilePage } from './pages/digital-human/CreateCloneMobilePage';
import { ChatPage } from './pages/ChatPage';
import { CreateContactPage } from './pages/contacts/CreateContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/profile/EditProfilePage';
import { SettingsPage } from './pages/profile/SettingsPage';
import { AvatarsPage } from './pages/profile/digital-identity/AvatarsPage';
import { VoicesPage } from './pages/profile/digital-identity/VoicesPage';
import { ImagesPage } from './pages/profile/content-library/ImagesPage';
import { ScenesPage } from './pages/profile/content-library/ScenesPage';
import { BadgesPage } from './pages/profile/achievements/BadgesPage';
import { RankingsPage } from './pages/profile/achievements/RankingsPage';
import { LoginPage } from './pages/LoginPage';
import { TextToImagePage } from './pages/creation/TextToImagePage';
import { ThreeDScenePage } from './pages/creation/ThreeDScenePage';
import { ImageListPage } from './pages/ImageListPage';
import { SceneListPage } from './pages/SceneListPage';
import { FoodDetailPage } from './pages/FoodDetailPage';

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // 初始化微信 JS-SDK
    initWxSDK();
  }, []);

  const hideNav = location.pathname.startsWith('/create') || 
                 location.pathname.startsWith('/digital-human/create') ||
                 location.pathname.startsWith('/profile/') ||
                 location.pathname === '/contacts/create' ||
                 location.pathname === '/login' ||
                 location.pathname === '/food';

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/discovery" replace />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/digital-human" element={<DigitalHumanPage />} />
        <Route path="/digital-human/create" element={<CreateDigitalHumanPage />} />
        <Route path="/digital-human/create-clone" element={<CreateCloneMobilePage />} />
        <Route path="/chat" element={<AuthGuard><ChatPage /></AuthGuard>} />
        <Route path="/contacts/create" element={<AuthGuard><CreateContactPage /></AuthGuard>} />
        <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
        <Route path="/profile/edit" element={<AuthGuard><EditProfilePage /></AuthGuard>} />
        <Route path="/profile/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
        <Route path="/digital-identity/avatars" element={<AuthGuard><AvatarsPage /></AuthGuard>} />
        <Route path="/digital-identity/voices" element={<AuthGuard><VoicesPage /></AuthGuard>} />
        <Route path="/content-library/images" element={<AuthGuard><ImagesPage /></AuthGuard>} />
        <Route path="/content-library/scenes" element={<AuthGuard><ScenesPage /></AuthGuard>} />
        <Route path="/achievements/badges" element={<AuthGuard><BadgesPage /></AuthGuard>} />
        <Route path="/achievements/rankings" element={<AuthGuard><RankingsPage /></AuthGuard>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create/text-to-image" element={<TextToImagePage />} />
        <Route path="/create/3d-scene" element={<ThreeDScenePage />} />
        <Route path="/images" element={<ImageListPage />} />
        <Route path="/scenes" element={<SceneListPage />} />
        <Route path="/food" element={<FoodDetailPage />} />
      </Routes>
      
      {!hideNav && (
        <BottomNav 
          activeNav={location.pathname.slice(1) || 'discovery'} 
          onNavChange={() => {}}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
