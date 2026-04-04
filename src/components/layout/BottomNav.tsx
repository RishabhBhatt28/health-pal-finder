import { useLocation, useNavigate } from "react-router-dom";
import { Activity, Calculator, Dumbbell, Building2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", label: "Dashboard", icon: Activity },
  { path: "/calculator", label: "Calculator", icon: Calculator },
  { path: "/exercise", label: "Exercise", icon: Dumbbell },
  { path: "/hospitals", label: "Hospitals", icon: Building2 },
  { path: "/chat", label: "AI Chat", icon: MessageCircle },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show nav on auth pages
  if (location.pathname === "/auth") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
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
  );
}
