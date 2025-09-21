import { Link, useLocation } from "react-router-dom";
import { Home, Building2, Users, Briefcase, BarChart3, Target, Megaphone, ChevronDown, ChevronRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { 
    name: "Jobs", 
    href: "/jobs",
    icon: Briefcase,
    subItems: [
      { name: "ALL JOBS", href: "/jobs" },
      { name: "NEW JOBS", href: "/jobs/new" },
      { name: "MORNING VIEW", href: "/jobs/morning-view" },
      { name: "ENDING SOON", href: "/jobs/ending-soon" },
    ]
  },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Opportunities", href: "/opportunities", icon: Target },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Automations", href: "/automations", icon: Bot },
  { name: "Reporting", href: "/reporting", icon: BarChart3 },
];

export const Sidebar = () => {
  const location = useLocation();
  const [expandedJobs, setExpandedJobs] = useState(false);

  return (
    <aside className="w-52 bg-sidebar backdrop-blur border-r border-sidebar-border flex flex-col fixed left-0 top-0 h-screen z-40">
      <div className="px-4 py-6 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">4Twenty CRM</h1>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          
          if (item.subItems) {
            const isJobsActive = location.pathname.startsWith('/jobs');
            
            return (
              <div key={item.name} className="space-y-1">
                <Link
                  to={item.href || '#'}
                  onClick={() => setExpandedJobs(!expandedJobs)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full",
                    isJobsActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  {expandedJobs ? (
                    <ChevronDown className="h-3 w-3 ml-auto" />
                  ) : (
                    <ChevronRight className="h-3 w-3 ml-auto" />
                  )}
                </Link>
                
                {expandedJobs && (
                  <div className="ml-6 space-y-1">
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                            isSubActive
                              ? "bg-sidebar-primary/80 text-sidebar-primary-foreground"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          
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