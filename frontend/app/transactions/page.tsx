import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionsMonitoring } from "@/components/transactions-monitoring"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Transactions Monitoring</h1>
          <div className="text-sm text-muted-foreground">Real-time transaction feed</div>
        </div>
        <TransactionsMonitoring />
      </div>
    </DashboardLayout>
  )
}
