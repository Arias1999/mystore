"use client";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "1px solid var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
          },
        }}
      />
    </ThemeProvider>
  );
}
