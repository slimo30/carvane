import { DashboardLayout } from "@/components/dashboard-layout"
import { SecurityAlerts } from "@/components/security-alerts"

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Security & Alerts</h1>
          <div className="text-sm text-muted-foreground">Monitor fraud detection and system alerts</div>
        </div>
        <SecurityAlerts />
      </div>
    </DashboardLayout>
  )
}
