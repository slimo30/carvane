import { DashboardLayout } from "@/components/dashboard-layout"
import { UserManagement } from "@/components/user-management"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">User Management</h1>
          <div className="text-sm text-muted-foreground">Manage restaurant admins and permissions</div>
        </div>
        <UserManagement />
      </div>
    </DashboardLayout>
  )
}
