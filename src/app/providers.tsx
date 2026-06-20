"use client";

import { SessionProvider } from "next-auth/react";
import { AtmosphereProvider } from "../frontend/utils/AtmosphereContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AtmosphereProvider>
        {children}
      </AtmosphereProvider>
    </SessionProvider>
  );
}
