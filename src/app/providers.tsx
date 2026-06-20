"use client";

import { AtmosphereProvider } from "../frontend/utils/AtmosphereContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AtmosphereProvider>
        {children}
      </AtmosphereProvider>
    </SessionProvider>
  );
}
