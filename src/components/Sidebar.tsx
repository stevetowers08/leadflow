import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">4Twenty CRM</h1>
      </div>
      
      <nav className="flex-1 px-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6">
        <Button asChild className="w-full">
          <Link to="/leads">Add New Lead</Link>
        </Button>
      </div>
    </aside>
  );
};