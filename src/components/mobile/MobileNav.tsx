import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Building2, Briefcase, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const items: NavItem[] = [
  { to: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { to: "/people", label: "People", icon: <Users className="h-5 w-5" /> },
  { to: "/companies", label: "Companies", icon: <Building2 className="h-5 w-5" /> },
  { to: "/jobs", label: "Jobs", icon: <Briefcase className="h-5 w-5" /> },
  { to: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

export const MobileNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav 
      className="fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.to} className="flex">
            <NavLink
              to={item.to}
              className={({ isActive }) => cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2",
                "text-xs transition-colors select-none touch-manipulation",
                "min-h-[44px] min-w-[44px]", // Ensure minimum touch target
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              {item.icon}
              <span className="leading-none">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;



