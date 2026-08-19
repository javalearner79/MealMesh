"use client";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
export function DashboardShell({ children }: { children: React.ReactNode }) { return <ThemeProvider attribute="class" defaultTheme="light" enableSystem><div className="min-h-screen lg:flex"><Sidebar /><main className="min-w-0 flex-1" id="main-content"><Topbar />{children}</main></div></ThemeProvider>; }
