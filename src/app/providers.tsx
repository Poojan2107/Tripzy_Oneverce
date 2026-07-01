"use client";

import { AtmosphereProvider } from "../frontend/utils/AtmosphereContext";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "../frontend/components/ui/Toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AtmosphereProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AtmosphereProvider>
    </SessionProvider>
  );
}
