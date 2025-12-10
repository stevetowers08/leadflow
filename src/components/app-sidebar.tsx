"use client"

import * as React from "react"
import {
  LayoutDashboard,
  MessageSquare,
  Settings2,
  Users,
  GitMerge,
  BarChart3,
} from "lucide-react"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { RecruitEdgeLogo } from "@/components/RecruitEdgeLogo"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"

/**
 * Updated Navigation - PDR Section 5.1
 * 
 * LeadFlow Console Navigation:
 * - Overview (/) - Icon: LayoutDashboard
 * - Leads (/leads) - Icon: Users
 * - Inbox (/inbox) - Icon: MessageSquare
 * - Workflows (/workflows) - Icon: GitMerge
 * - Settings (/settings) - Icon: Settings2
 */
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Leads",
      url: "/leads",
      icon: Users,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: MessageSquare,
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: GitMerge,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const userData = {
    name: user?.email?.split("@")[0] || "User",
    email: user?.email || "user@example.com",
    avatar: user?.avatar_url || "/avatars/default.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <RecruitEdgeLogo className="text-base font-semibold" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
