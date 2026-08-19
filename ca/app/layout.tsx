import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "CampusSplit AI", description: "Campus financial collaboration" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning><body><a className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:outline-none" href="#main-content">Skip to main content</a>{children}</body></html>; }
