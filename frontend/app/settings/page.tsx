import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsSection } from "@/components/settings-section"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">System Settings</h1>
          <div className="text-sm text-muted-foreground">Configure platform settings</div>
        </div>
        <SettingsSection />
      </div>
    </DashboardLayout>
  )
}
