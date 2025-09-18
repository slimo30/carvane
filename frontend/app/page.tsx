import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GlobalKPIs } from "@/components/global-kpis"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Dashboard Overview</h1>
          <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</div>
        </div>
        <GlobalKPIs />
      </div>
             <AnalyticsDashboard />
      
    </DashboardLayout>
    
  )
}
