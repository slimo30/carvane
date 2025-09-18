"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertTriangle, CheckCircle, MoreHorizontal, Bell, Shield, CreditCard, Store } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "security",
    title: "Suspicious login attempt detected",
    description: "Multiple failed login attempts from IP 192.168.1.100",
    timestamp: "2 minutes ago",
    status: "unread",
    priority: "high",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment processing issue",
    description: "Restaurant 'Bella Vista' payment failed - insufficient funds",
    timestamp: "15 minutes ago",
    status: "unread",
    priority: "medium",
    icon: CreditCard,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 3,
    type: "system",
    title: "System maintenance completed",
    description: "Scheduled maintenance window completed successfully",
    timestamp: "1 hour ago",
    status: "read",
    priority: "low",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 4,
    type: "user",
    title: "New restaurant registration",
    description: "Golden Dragon Restaurant has completed onboarding",
    timestamp: "2 hours ago",
    status: "read",
    priority: "low",
    icon: Store,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 5,
    type: "alert",
    title: "High transaction volume alert",
    description: "Transaction volume exceeded 150% of normal levels",
    timestamp: "3 hours ago",
    status: "unread",
    priority: "medium",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
]

export function NotificationCenter() {
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedTab === "all") return true
    if (selectedTab === "unread") return notification.status === "unread"
    return notification.type === selectedTab
  })

  const unreadCount = notifications.filter((n) => n.status === "unread").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <span className="text-lg font-medium">All Notifications</span>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} unread</Badge>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm">
            Clear All
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="user">Users</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No notifications</p>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <Card
                    key={notification.id}
                    className={`transition-colors ${notification.status === "unread" ? "border-l-4 border-l-primary" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                          <Icon className={`h-5 w-5 ${notification.color}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{notification.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  notification.priority === "high"
                                    ? "destructive"
                                    : notification.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Mark as Read</DropdownMenuItem>
                                  <DropdownMenuItem>Archive</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
