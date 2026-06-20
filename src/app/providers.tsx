"use client";

import { AtmosphereProvider } from "../frontend/utils/AtmosphereContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AtmosphereProvider>
      {children}
    </AtmosphereProvider>
  );
}
