import { DashboardLayout } from "@/components/dashboard-layout"
import { NotificationCenter } from "@/components/notification-center"

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Notification Center</h1>
          <div className="text-sm text-muted-foreground">Manage system alerts and messages</div>
        </div>
        <NotificationCenter />
      </div>
    </DashboardLayout>
  )
}
