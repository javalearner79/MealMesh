import { DashboardShell } from "@/components/layout/dashboard-shell";
import { PageTransition } from "@/components/animations/page-transition";
export default function Layout({ children }: { children: React.ReactNode }) { return <DashboardShell><PageTransition>{children}</PageTransition></DashboardShell>; }
