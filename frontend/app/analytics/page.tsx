import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 ">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Analytics Dashboard</h1>
          <div className="text-sm text-muted-foreground">Global insights across all restaurants</div>
        </div>

        <div>
          <AnalyticsDashboard />
        </div>
      </div>
    </DashboardLayout>
  )
}
