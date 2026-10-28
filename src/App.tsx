import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LightboxModal } from './components/common/LightboxModal';
import { HeroSection } from './components/home/HeroSection';
import { EditorialPhilosophy } from './components/home/EditorialPhilosophy';
import { FeaturedLooks } from './components/home/FeaturedLooks';
import { StudioSeries } from './components/home/StudioSeries';
import { AboutModel } from './components/home/AboutModel';
import { ThreeSidesSection } from './components/home/ThreeSidesSection';
import { PortfolioGallery } from './components/home/PortfolioGallery';
import { ContactSection } from './components/home/ContactSection';
import { AdminPage } from './components/admin/AdminPage';
import { GalleryItem } from './types';

const MainApp: React.FC = () => {
  const { gallery } = useContent();
  const [selectedLook, setSelectedLook] = useState<GalleryItem | null>(null);
  const [currentRoute, setCurrentRoute] = useState<'home' | 'admin'>('home');

  // Detect /admin path or #/admin hash
  useEffect(() => {
    const checkRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      if (pathname === '/admin' || hash === '#/admin' || hash === '#admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '/admin';
    setCurrentRoute('admin');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
    setCurrentRoute('home');
  };

  const handleExploreClick = () => {
    const el = document.getElementById('portfolio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentRoute === 'admin') {
    return <AdminPage onBackToSite={navigateToHome} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#e5e5e7] selection:bg-[#E50920] selection:text-white">
      {/* Subtle Cinematic Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none grain-overlay opacity-25 z-40" />

      {/* Luxury Navigation with Live Status Beacon & Admin Access */}
      <Navbar onNavigateToAdmin={navigateToAdmin} />

      {/* Main Single-Page Portfolio in Black-and-Crimson Aesthetic */}
      <main>
        {/* 1. Hero Section (Monumental UNSEEN backdrop + Dominant Foreground Model Photograph) */}
        <HeroSection onExploreClick={handleExploreClick} />

        {/* 2. Editorial Philosophy Statement */}
        <EditorialPhilosophy />

        {/* 3. Selected Visuals / Featured Looks (3-column layout) */}
        <FeaturedLooks onSelectLook={setSelectedLook} />

        {/* 4. Studio Archive Series (Square frames with red accent tags) */}
        <StudioSeries onSelectLook={setSelectedLook} />

        {/* 5. About the Model & Manifesto (Unfold Bold Side & Effortless Dressing) */}
        <AboutModel onSelectLook={setSelectedLook} />

        {/* 6. 3 Sides Of Me (The Bold, The Elegant, The Wild) */}
        <ThreeSidesSection onSelectLook={setSelectedLook} />

        {/* 7. Comprehensive Model Visuals Gallery (Filterable by category) */}
        <PortfolioGallery onSelectLook={setSelectedLook} />

        {/* 8. Functional Collaboration & Booking System */}
        <ContactSection />
      </main>

      {/* Minimal Footer */}
      <Footer onNavigateToAdmin={navigateToAdmin} />

      {/* Full-Screen Lightbox Modal for Original Photographs */}
      <LightboxModal
        item={selectedLook}
        items={gallery}
        onClose={() => setSelectedLook(null)}
        onSelect={setSelectedLook}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <MainApp />
      </ContentProvider>
    </AuthProvider>
  );
}
