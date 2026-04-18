'use client';

/**
 * device-provider.tsx
 * React Context that carries the SSR-detected device type into the client tree.
 * One concern: bridge server-detected device → client components via context.
 *
 * The initial value comes from the server (no layout shift).
 * A matchMedia listener updates it if the user resizes across the mobile breakpoint.
 */

import { createContext, useContext, useEffect, useState } from 'react';
import type { DeviceType } from '@/lib/device';

interface DeviceContextValue {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextValue>({
  deviceType: 'desktop',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

interface DeviceProviderProps {
  children: React.ReactNode;
  initialDevice: DeviceType;
}

export function DeviceProvider({ children, initialDevice }: DeviceProviderProps) {
  const [deviceType, setDeviceType] = useState<DeviceType>(initialDevice);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    function update() {
      if (mobileQuery.matches) setDeviceType('mobile');
      else if (tabletQuery.matches) setDeviceType('tablet');
      else setDeviceType('desktop');
    }

    mobileQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);

    return () => {
      mobileQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, []);

  const value: DeviceContextValue = {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice(): DeviceContextValue {
  return useContext(DeviceContext);
}
