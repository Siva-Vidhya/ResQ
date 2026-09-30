import React, { useEffect } from 'react';
import { useResQStore } from '../../store/useResQStore';
import { useLocation } from '../../hooks/useLocation';
import { Navbar } from './Navbar';
import { SlideDownAlertBanner } from './SlideDownAlertBanner';
import { MobileBottomBar } from './MobileBottomBar';
import { FloatingTextControl } from './FloatingTextControl';
import { Toast } from './Toast';
import { Footer } from './Footer';
import { RainCanvas } from './RainCanvas';
import { PageWaterWipe } from './PageWaterWipe';
import { BackgroundScene } from './BackgroundScene';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const { setActiveTab, ariaAnnouncement } = useResQStore();

  // Continuously watch user position & evaluate nearby flood alerts
  useLocation();

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/+$/, '') || '/';
      if (path === '/route') setActiveTab('route');
      else if (path === '/alerts') setActiveTab('alerts');
      else if (path === '/reports') setActiveTab('reports');
      else setActiveTab('home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveTab]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-transparent text-[#2B2A4C] font-sans relative isolate">
      {/* Decorative Layered Waves & Clouds Background (z-[-1], pointer-events-none, pure SVG) */}
      <BackgroundScene />

      {/* Global Interactive Rain Canvas (z-20, pointer-events-none, scaled to risk & route) */}
      <RainCanvas />

      {/* Smooth Water-Wave Page Transition Wipe (600ms top-to-bottom blue-teal wave) */}
      <PageWaterWipe />

      {/* Screen-Reader Live Region */}
      <div role="status" aria-live="assertive" aria-atomic="true" className="sr-only">
        {ariaAnnouncement}
      </div>

      {/* Header: Logo, 4 Nav Links, Language Switch */}
      <Navbar />

      {/* Slide-Down Alert Banner at Top of App when an Alert Triggers */}
      <SlideDownAlertBanner />

      {/* Main Content */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 pb-28 lg:pb-14 focus:outline-none"
      >
        {children}
      </main>

      {/* Floating "Aa" Control for Larger Text */}
      <FloatingTextControl />

      {/* Mobile Bottom Tab Bar (4 icons + labels) */}
      <MobileBottomBar />

      {/* Toast Feedback */}
      <Toast />

      {/* Calm Emergency Helpline Footer with "Try a demo alert" link */}
      <Footer />
    </div>
  );
};
