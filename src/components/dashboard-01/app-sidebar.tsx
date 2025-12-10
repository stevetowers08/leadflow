"use client"

import * as React from "react"
import {
  BarChart3,
  Home,
  Megaphone,
  MessageSquare,
  Rocket,
  Settings,
  Target,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { RecruitEdgeLogo } from "@/components/RecruitEdgeLogo"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  {
    title: "Getting Started",
    items: [
      {
        title: "Getting Started",
        url: "/getting-started",
        icon: Rocket,
      },
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
      },
    ],
  },
  {
    title: "Core Campaigns",
    items: [
      {
        title: "Contacts",
        url: "/contacts",
        icon: Users,
      },
      {
        title: "Conversations",
        url: "/conversations",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Advanced Features",
    items: [
      {
        title: "Deals",
        url: "/pipeline",
        icon: Target,
      },
      {
        title: "Campaigns",
        url: "/campaigns",
        icon: Megaphone,
      },
      {
        title: "Analytics",
        url: "/reporting",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <RecruitEdgeLogo className="font-semibold text-lg" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          © 2025 Leadflow
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

