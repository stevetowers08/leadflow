import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Users, Briefcase, BarChart3, Target, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Opportunities", href: "/opportunities", icon: Target },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Reporting", href: "/reporting", icon: BarChart3 },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-52 bg-sidebar backdrop-blur border-r border-sidebar-border flex flex-col fixed left-0 top-0 h-screen z-40">
      <div className="px-4 py-6 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">4Twenty CRM</h1>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-3 border-t border-sidebar-border">
        <Button asChild size="sm" className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground">
          <Link to="/leads">Add New Lead</Link>
        </Button>
      </div>
    </aside>
  );
};