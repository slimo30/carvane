"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SignOut, BellRinging, Books, Users as PhUsers, Layout as PhLayout, CheckSquare as PhCheckSquare, Warning } from "phosphor-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Vue d'ensemble",
      href: "/admin",
      icon: PhLayout,
      current: pathname === "/admin",
    },
    {
      name: "Employés",
      href: "/admin/employees",
      icon: PhUsers,
      current: pathname === "/admin/employees",
    },
    {
      name: "File de validation",
      href: "/admin/validation-queue",
      icon: PhCheckSquare,
      current: pathname === "/admin/validation-queue",
      badge: 3,
    },
    {
      name: "Gestion recettes",
      href: "/admin/recipes",
      icon: Books,
      current: pathname === "/admin/recipes",
    },
    {
      name: "Problèmes",
      href: "/admin/problems",
      icon: Warning,
      current: pathname === "/admin/problems",
      badge: 2,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Chef Mode - Administration</h1>
            <p className="text-sm text-muted-foreground">Interface de gestion et supervision</p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <BellRinging className="h-4 w-4 mr-2" />
              Notifications
              <Badge variant="destructive" className="ml-2">
                2
              </Badge>
            </Button>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-medium">Chef Martin</div>
                <div className="text-xs text-muted-foreground">Administrateur</div>
              </div>
              <Button variant="ghost" size="sm">
                <SignOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-sidebar border-r border-sidebar-border p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={item.current ? "default" : "ghost"}
                    className={cn("w-full justify-start", item.current && "bg-primary text-primary-foreground")}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
