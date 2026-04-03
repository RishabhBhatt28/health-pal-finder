import { NavLink } from "react-router-dom";
import { Activity, Calculator, MapPin, MessageCircle } from "lucide-react";

const tabs = [
  { to: "/", icon: Activity, label: "Dashboard" },
  { to: "/calculator", icon: Calculator, label: "Calculator" },
  { to: "/hospitals", icon: MapPin, label: "Hospitals" },
  { to: "/ai-doctor", icon: MessageCircle, label: "AI Doctor" },
];

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
    <div className="flex items-center justify-around max-w-lg mx-auto">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-2 px-3 text-xs transition-colors ${
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default BottomNav;
