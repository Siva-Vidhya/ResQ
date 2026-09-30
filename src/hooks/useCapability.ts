import { useState, useEffect } from 'react';

export interface DeviceCapability {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  isLowPower: boolean;
  prefersReducedMotion: boolean;
  isTouch: boolean;
  tier: 'high' | 'medium' | 'low';
  renderer: string;
}

export function useCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(() => {
    // Initial SSR-safe defaults
    return {
      hasWebGL: true,
      hasWebGL2: true,
      isLowPower: false,
      prefersReducedMotion: false,
      isTouch: false,
      tier: 'high',
      renderer: 'Detecting...',
    };
  });

  useEffect(() => {
    let hasWebGL = false;
    let hasWebGL2 = false;
    let renderer = 'Software Renderer';

    try {
      const canvas = document.createElement('canvas');
      const gl2 = canvas.getContext('webgl2');
      if (gl2) {
        hasWebGL2 = true;
        hasWebGL = true;
        const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          renderer = gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Hardware Accelerated';
        }
      } else {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          hasWebGL = true;
          const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Hardware Accelerated';
          }
        }
      }
    } catch {
      hasWebGL = false;
      hasWebGL2 = false;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = motionQuery.matches;

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const cores = navigator.hardwareConcurrency || 4;
    const isLowPower = cores <= 2 || !hasWebGL;

    let tier: 'high' | 'medium' | 'low' = 'high';
    if (!hasWebGL || cores <= 2) {
      tier = 'low';
    } else if (!hasWebGL2 || cores <= 4) {
      tier = 'medium';
    }

    setCapability({
      hasWebGL,
      hasWebGL2,
      isLowPower,
      prefersReducedMotion,
      isTouch,
      tier,
      renderer,
    });

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapability((prev) => ({ ...prev, prefersReducedMotion: e.matches }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  return capability;
}
