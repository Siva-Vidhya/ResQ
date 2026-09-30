import React, { useEffect, useState } from 'react';
import { useResQStore } from '../../store/useResQStore';

export const PageWaterWipe: React.FC = () => {
  const { isPageWiping } = useResQStore();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isPageWiping) {
      setAnimating(true);
    } else {
      const timer = setTimeout(() => setAnimating(false), 650);
      return () => clearTimeout(timer);
    }
  }, [isPageWiping]);

  if (!animating) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
    >
      <div className="water-wave-wipe w-full h-full flex flex-col justify-end">
        {/* Leading wave crest at the bottom of the water curtain */}
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 text-teal-400 drop-shadow-md transform translate-y-1"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,-20 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};
