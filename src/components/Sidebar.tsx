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
    <aside className="w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border/40 flex flex-col">
      <div className="px-6 py-8">
        <h1 className="text-xl font-semibold text-foreground">4Twenty CRM</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 hover-scale",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border/40">
        <Button asChild size="sm" className="w-full">
          <Link to="/leads">Add New Lead</Link>
        </Button>
      </div>
    </aside>
  );
};