import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Store, ShoppingCart, DollarSign, Users } from "lucide-react"

const kpis = [
  {
    title: "Total Restaurants",
    value: "247",
    change: "+12",
    changeType: "increase" as const,
    icon: Store,
    description: "Active restaurants",
  },
  {
    title: "Orders Today",
    value: "1,429",
    change: "+23%",
    changeType: "increase" as const,
    icon: ShoppingCart,
    description: "vs yesterday",
  },
  {
    title: "Revenue Today",
    value: "$89,247",
    change: "+18%",
    changeType: "increase" as const,
    icon: DollarSign,
    description: "vs yesterday",
  },
  {
    title: "Average Order Value",
    value: "$62.45",
    change: "-2.1%",
    changeType: "decrease" as const,
    icon: TrendingUp,
    description: "vs last week",
  },
  {
    title: "Active Customers",
    value: "12,847",
    change: "+8.2%",
    changeType: "increase" as const,
    icon: Users,
    description: "vs last month",
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    changeType: "increase" as const,
    icon: TrendingUp,
    description: "Average rating",
  },
]

export function GlobalKPIs() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Badge
                variant={kpi.changeType === "increase" ? "default" : "destructive"}
                className={`flex items-center space-x-1 ${
                  kpi.changeType === "increase"
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                }`}
              >
                {kpi.changeType === "increase" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{kpi.change}</span>
              </Badge>
              <span>{kpi.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
