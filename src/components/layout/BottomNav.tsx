import { useLocation, useNavigate } from "react-router-dom";
import { Activity, Calculator, Dumbbell, Building2, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "Dashboard", icon: Activity },
  { path: "/calculator", label: "Calculator", icon: Calculator },
  { path: "/exercise", label: "Exercise", icon: Dumbbell },
  { path: "/hospitals", label: "Hospitals", icon: Building2 },
  { path: "/chat", label: "AI Chat", icon: MessageCircle },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/auth") return null;

  return (
    <>
      {/* Mobile/Tablet: Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg safe-area-bottom lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          {tabs.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10px] sm:text-xs transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop: Side nav */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 z-50 w-20 flex-col items-center py-6 gap-2 border-r bg-card/95 backdrop-blur-lg">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-[10px] transition-colors w-full",
                isActive
                  ? "text-primary font-semibold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
