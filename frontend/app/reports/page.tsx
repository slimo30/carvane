import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsSection } from "@/components/reports-section"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Reports</h1>
          <div className="text-sm text-muted-foreground">Generate and download reports</div>
        </div>
        <ReportsSection />
      </div>
    </DashboardLayout>
  )
}
