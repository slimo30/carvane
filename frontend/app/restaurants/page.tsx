import { DashboardLayout } from "@/components/dashboard-layout"
import { RestaurantManagement } from "@/components/restaurant-management"

export default function RestaurantsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Restaurant Management</h1>
          <div className="text-sm text-muted-foreground">247 total restaurants</div>
        </div>
        <RestaurantManagement />
      </div>
    </DashboardLayout>
  )
}
