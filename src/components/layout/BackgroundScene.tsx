import React from 'react';
import { useResQStore } from '../../store/useResQStore';

export const BackgroundScene: React.FC = () => {
  const { activeTab } = useResQStore();
  const isRoute = activeTab === 'route';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none transition-opacity duration-700 ${
        isRoute ? 'opacity-40' : 'opacity-100'
      }`}
      style={{ zIndex: -1 }}
    >
      {/* Optional soft blush-to-sky top gradient on warm cream background */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 45% at 50% 0%, rgba(255, 221, 232, 0.40) 0%, rgba(220, 235, 255, 0.30) 45%, transparent 70%)',
        }}
      />

      {/* 1. CLOUDS (Top of the screen: 4-5 soft, rounded layered cloud shapes) */}
      <div className="absolute inset-x-0 top-0 h-48 sm:h-56 lg:h-64 pointer-events-none overflow-hidden">
        {/* Cloud 1: Soft White (70% opacity, drifting 68s) */}
        <div
          className="cloud-drift-layer absolute top-3 sm:top-5 filter blur-[3px]"
          style={{
            animation: 'resqCloudDrift1 68s linear infinite',
            animationDelay: '-18s',
          }}
        >
          <svg
            width="280"
            height="100"
            viewBox="0 0 280 100"
            fill="rgba(255, 255, 255, 0.70)"
            className="w-[200px] sm:w-[280px] h-auto drop-shadow-xs"
          >
            <path d="M 40 76 a 28 28 0 0 1 36 -24 a 42 42 0 0 1 76 -6 a 32 32 0 0 1 52 10 a 26 26 0 0 1 28 20 a 20 20 0 0 1 -12 22 l -168 0 a 20 20 0 0 1 -12 -22 z" />
          </svg>
        </div>

        {/* Cloud 2: Baby Blue #DCEBFF (drifting 92s) */}
        <div
          className="cloud-drift-layer absolute top-8 sm:top-12 filter blur-[4px]"
          style={{
            animation: 'resqCloudDrift2 92s linear infinite',
            animationDelay: '-48s',
          }}
        >
          <svg
            width="340"
            height="115"
            viewBox="0 0 340 115"
            fill="#DCEBFF"
            fillOpacity="0.75"
            className="w-[240px] sm:w-[340px] h-auto drop-shadow-xs"
          >
            <path d="M 46 86 a 32 32 0 0 1 42 -28 a 52 52 0 0 1 96 -8 a 38 38 0 0 1 62 12 a 30 30 0 0 1 36 22 a 24 24 0 0 1 -16 26 l -204 0 a 24 24 0 0 1 -16 -24 z" />
          </svg>
        </div>

        {/* Cloud 3: Lavender #E8DEFF (drifting 115s) */}
        <div
          className="cloud-drift-layer absolute top-2 sm:top-4 filter blur-[3px]"
          style={{
            animation: 'resqCloudDrift3 115s linear infinite',
            animationDelay: '-82s',
          }}
        >
          <svg
            width="260"
            height="95"
            viewBox="0 0 260 95"
            fill="#E8DEFF"
            fillOpacity="0.70"
            className="w-[180px] sm:w-[260px] h-auto drop-shadow-xs"
          >
            <path d="M 36 72 a 24 24 0 0 1 34 -20 a 40 40 0 0 1 70 -5 a 30 30 0 0 1 46 8 a 24 24 0 0 1 26 18 a 18 18 0 0 1 -12 20 l -152 0 a 18 18 0 0 1 -12 -21 z" />
          </svg>
        </div>

        {/* Cloud 4: Blush #FFDDE8 (drifting 78s) */}
        <div
          className="cloud-drift-layer absolute top-14 sm:top-16 filter blur-[4px]"
          style={{
            animation: 'resqCloudDrift4 78s linear infinite',
            animationDelay: '-32s',
          }}
        >
          <svg
            width="230"
            height="85"
            viewBox="0 0 230 85"
            fill="#FFDDE8"
            fillOpacity="0.65"
            className="w-[170px] sm:w-[230px] h-auto drop-shadow-xs"
          >
            <path d="M 30 64 a 22 22 0 0 1 28 -18 a 34 34 0 0 1 62 -4 a 26 26 0 0 1 42 7 a 20 20 0 0 1 22 15 a 16 16 0 0 1 -10 18 l -134 0 a 16 16 0 0 1 -10 -18 z" />
          </svg>
        </div>

        {/* Cloud 5: Pure White Foreground Accent (drifting 100s) */}
        <div
          className="cloud-drift-layer absolute top-5 sm:top-9 filter blur-[2px]"
          style={{
            animation: 'resqCloudDrift1 100s linear infinite',
            animationDelay: '-60s',
          }}
        >
          <svg
            width="300"
            height="105"
            viewBox="0 0 300 105"
            fill="rgba(255, 255, 255, 0.70)"
            className="w-[210px] sm:w-[300px] h-auto drop-shadow-xs"
          >
            <path d="M 40 80 a 30 30 0 0 1 36 -26 a 46 46 0 0 1 82 -6 a 34 34 0 0 1 54 10 a 28 28 0 0 1 30 20 a 22 22 0 0 1 -14 24 l -174 0 a 22 22 0 0 1 -14 -22 z" />
          </svg>
        </div>
      </div>

      {/* 2. WAVES (Bottom of the screen: bottom ~18-22% on desktop, ~12% on mobile) */}
      <div
        className={`absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden transition-all duration-700 ${
          isRoute
            ? 'h-[8vh] max-h-[70px]'
            : 'h-[12vh] sm:h-[18vh] lg:h-[21vh] max-h-[200px]'
        }`}
      >
        {/* Wave 1: Back Wave - Baby Blue #CFE3FF (14s sway) */}
        <div
          className="wave-sway-layer absolute inset-x-[-8%] bottom-0 w-[116%] h-full"
          style={{
            animation: 'resqWaveSway1 14s ease-in-out infinite alternate',
          }}
        >
          <svg
            viewBox="0 0 1920 180"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M 0,55 C 320,105 680,15 1040,65 C 1400,115 1680,25 1920,60 L 1920,180 L 0,180 Z"
              fill="#CFE3FF"
              fillOpacity="0.60"
            />
          </svg>
        </div>

        {/* Wave 2: Periwinkle #C9D4FF (11s sway) */}
        <div
          className="wave-sway-layer absolute inset-x-[-8%] bottom-0 w-[116%] h-full"
          style={{
            animation: 'resqWaveSway2 11s ease-in-out infinite alternate',
          }}
        >
          <svg
            viewBox="0 0 1920 180"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M 0,80 C 260,35 620,125 960,65 C 1300,10 1620,105 1920,75 L 1920,180 L 0,180 Z"
              fill="#C9D4FF"
              fillOpacity="0.70"
            />
          </svg>
        </div>

        {/* Wave 3: Mint #CDEFE0 (15s sway) */}
        <div
          className="wave-sway-layer absolute inset-x-[-8%] bottom-0 w-[116%] h-full"
          style={{
            animation: 'resqWaveSway3 15s ease-in-out infinite alternate',
          }}
        >
          <svg
            viewBox="0 0 1920 180"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M 0,105 C 360,70 720,140 1060,95 C 1380,45 1680,120 1920,95 L 1920,180 L 0,180 Z"
              fill="#CDEFE0"
              fillOpacity="0.75"
            />
          </svg>
        </div>

        {/* Wave 4: Front Wave - Soft Lavender #DCCFFF (9s sway, slightly more saturated) */}
        <div
          className="wave-sway-layer absolute inset-x-[-8%] bottom-0 w-[116%] h-full"
          style={{
            animation: 'resqWaveSway4 9s ease-in-out infinite alternate',
          }}
        >
          <svg
            viewBox="0 0 1920 180"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M 0,128 C 300,95 640,155 980,115 C 1320,75 1660,135 1920,120 L 1920,180 L 0,180 Z"
              fill="#DCCFFF"
              fillOpacity="0.85"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
