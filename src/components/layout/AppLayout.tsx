import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

const AppLayout = () => {
  const location = useLocation();
  const isChat = location.pathname === "/ai-doctor";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="health-gradient px-4 py-3 text-white flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
          S
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">SmartHealth Advisor</h1>
          <p className="text-xs text-white/80">AI-Powered Health Companion</p>
        </div>
      </header>

      {/* Content */}
      <main className={`flex-1 overflow-y-auto ${isChat ? "" : "pb-20"}`}>
        <Outlet />
      </main>

      {/* Bottom Nav - hidden on chat page (has its own) */}
      {!isChat && <BottomNav />}
    </div>
  );
};

export default AppLayout;
