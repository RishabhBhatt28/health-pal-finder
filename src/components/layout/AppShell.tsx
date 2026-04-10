import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pb-20 lg:pb-4 lg:pl-20">{children}</main>
      <BottomNav />
    </div>
  );
}
