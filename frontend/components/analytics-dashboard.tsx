// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import { TrendingUp, TrendingDown, Star, MapPin } from "lucide-react"

// // Sample data for charts
// const salesTrendData = [
//   { month: "Jan", revenue: 45000, orders: 1200 },
//   { month: "Feb", revenue: 52000, orders: 1350 },
//   { month: "Mar", revenue: 48000, orders: 1280 },
//   { month: "Apr", revenue: 61000, orders: 1520 },
//   { month: "May", revenue: 55000, orders: 1400 },
//   { month: "Jun", revenue: 67000, orders: 1680 },
// ]

// const popularDishesData = [
//   { name: "Margherita Pizza", orders: 2340, revenue: 35100 },
//   { name: "Chicken Teriyaki", orders: 1890, revenue: 28350 },
//   { name: "Caesar Salad", orders: 1650, revenue: 19800 },
//   { name: "Beef Burger", orders: 1420, revenue: 21300 },
//   { name: "Pad Thai", orders: 1280, revenue: 17920 },
// ]

// const busiestHoursData = [
//   { hour: "6 AM", orders: 45 },
//   { hour: "7 AM", orders: 120 },
//   { hour: "8 AM", orders: 180 },
//   { hour: "9 AM", orders: 95 },
//   { hour: "10 AM", orders: 65 },
//   { hour: "11 AM", orders: 85 },
//   { hour: "12 PM", orders: 320 },
//   { hour: "1 PM", orders: 380 },
//   { hour: "2 PM", orders: 290 },
//   { hour: "3 PM", orders: 150 },
//   { hour: "4 PM", orders: 120 },
//   { hour: "5 PM", orders: 180 },
//   { hour: "6 PM", orders: 420 },
//   { hour: "7 PM", orders: 480 },
//   { hour: "8 PM", orders: 390 },
//   { hour: "9 PM", orders: 280 },
//   { hour: "10 PM", orders: 180 },
//   { hour: "11 PM", orders: 95 },
// ]

// const customerBehaviorData = [
//   { name: "New Customers", value: 35, color: "hsl(var(--chart-1))" },
//   { name: "Returning Customers", value: 45, color: "hsl(var(--chart-2))" },
//   { name: "VIP Customers", value: 20, color: "hsl(var(--chart-3))" },
// ]

// const topPerformingRestaurants = [
//   {
//     name: "Bella Italia",
//     location: "New York, NY",
//     revenue: 45600,
//     orders: 1247,
//     rating: 4.8,
//     growth: 12.5,
//   },
//   {
//     name: "Sushi Zen",
//     location: "Los Angeles, CA",
//     revenue: 38200,
//     orders: 892,
//     rating: 4.9,
//     growth: 8.3,
//   },
//   {
//     name: "Taco Fiesta",
//     location: "Austin, TX",
//     revenue: 31800,
//     orders: 1089,
//     rating: 4.6,
//     growth: 15.2,
//   },
//   {
//     name: "Green Garden",
//     location: "San Francisco, CA",
//     revenue: 28900,
//     orders: 756,
//     rating: 4.7,
//     growth: -2.1,
//   },
// ]

// export function AnalyticsDashboard() {
//   return (
//     <div className="space-y-6">
//       {/* Time Period Selector */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-medium">Time Period:</span>
//           <Select defaultValue="30d">
//             <SelectTrigger className="w-[180px]">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7d">Last 7 days</SelectItem>
//               <SelectItem value="30d">Last 30 days</SelectItem>
//               <SelectItem value="90d">Last 90 days</SelectItem>
//               <SelectItem value="1y">Last year</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <Button variant="outline">Export Report</Button>
//       </div>

//       {/* Sales Trends */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Sales Trends</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={salesTrendData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis yAxisId="left" />
//               <YAxis yAxisId="right" orientation="right" />
//               <Tooltip />
//               <Legend />
//               <Bar yAxisId="right" dataKey="orders" fill="hsl(var(--chart-2))" name="Orders" />
//               <Line
//                 yAxisId="left"
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="hsl(var(--chart-1))"
//                 strokeWidth={3}
//                 name="Revenue ($)"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Popular Dishes */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Most Popular Dishes</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {popularDishesData.map((dish, index) => (
//                 <div key={dish.name} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
//                       {index + 1}
//                     </div>
//                     <div>
//                       <div className="font-medium">{dish.name}</div>
//                       <div className="text-sm text-muted-foreground">{dish.orders} orders</div>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="font-bold">${dish.revenue.toLocaleString()}</div>
//                     <div className="text-sm text-muted-foreground">revenue</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Customer Behavior */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Customer Behavior</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={customerBehaviorData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {customerBehaviorData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="mt-4 space-y-2">
//               {customerBehaviorData.map((item) => (
//                 <div key={item.name} className="flex items-center justify-between text-sm">
//                   <div className="flex items-center space-x-2">
//                     <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
//                     <span>{item.name}</span>
//                   </div>
//                   <span className="font-medium">{item.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Busiest Hours */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Busiest Hours</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={busiestHoursData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="hour" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="orders" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Top Performing Restaurants */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Top Performing Restaurants</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {topPerformingRestaurants.map((restaurant, index) => (
//               <div key={restaurant.name} className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
//                     {index + 1}
//                   </div>
//                   <div>
//                     <div className="font-semibold">{restaurant.name}</div>
//                     <div className="flex items-center text-sm text-muted-foreground">
//                       <MapPin className="mr-1 h-3 w-3" />
//                       {restaurant.location}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-6">
//                   <div className="text-center">
//                     <div className="font-bold">${restaurant.revenue.toLocaleString()}</div>
//                     <div className="text-xs text-muted-foreground">Revenue</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="font-bold">{restaurant.orders}</div>
//                     <div className="text-xs text-muted-foreground">Orders</div>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span className="font-medium">{restaurant.rating}</span>
//                   </div>
//                   <Badge
//                     variant={restaurant.growth > 0 ? "default" : "destructive"}
//                     className={`flex items-center space-x-1 ${
//                       restaurant.growth > 0
//                         ? "bg-primary/10 text-primary hover:bg-primary/20"
//                         : "bg-destructive/10 text-destructive hover:bg-destructive/20"
//                     }`}
//                   >
//                     {restaurant.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
//                     <span>{Math.abs(restaurant.growth)}%</span>
//                   </Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts"
import { TrendingUp, TrendingDown, Star, MapPin } from "lucide-react"

// Sample data for charts
const salesTrendData = [
  { month: "Jan", revenue: 45000, orders: 1200 },
  { month: "Feb", revenue: 52000, orders: 1350 },
  { month: "Mar", revenue: 48000, orders: 1280 },
  { month: "Apr", revenue: 61000, orders: 1520 },
  { month: "May", revenue: 55000, orders: 1400 },
  { month: "Jun", revenue: 67000, orders: 1680 },
]

const popularDishesData = [
  { name: "Margherita Pizza", orders: 2340, revenue: 35100 },
  { name: "Chicken Teriyaki", orders: 1890, revenue: 28350 },
  { name: "Caesar Salad", orders: 1650, revenue: 19800 },
  { name: "Beef Burger", orders: 1420, revenue: 21300 },
  { name: "Pad Thai", orders: 1280, revenue: 17920 },
]

const busiestHoursData = [
  { hour: "6 AM", orders: 45 },
  { hour: "7 AM", orders: 120 },
  { hour: "8 AM", orders: 180 },
  { hour: "9 AM", orders: 95 },
  { hour: "10 AM", orders: 65 },
  { hour: "11 AM", orders: 85 },
  { hour: "12 PM", orders: 320 },
  { hour: "1 PM", orders: 380 },
  { hour: "2 PM", orders: 290 },
  { hour: "3 PM", orders: 150 },
  { hour: "4 PM", orders: 120 },
  { hour: "5 PM", orders: 180 },
  { hour: "6 PM", orders: 420 },
  { hour: "7 PM", orders: 480 },
  { hour: "8 PM", orders: 390 },
  { hour: "9 PM", orders: 280 },
  { hour: "10 PM", orders: 180 },
  { hour: "11 PM", orders: 95 },
]

const customerBehaviorData = [
  { name: "New Customers", value: 35, color: "#3b82f6" },
  { name: "Returning Customers", value: 45, color: "#10b981" },
  { name: "VIP Customers", value: 20, color: "#f59e0b" },
]

const topPerformingRestaurants = [
  {
    name: "Bella Italia",
    location: "New York, NY",
    revenue: 45600,
    orders: 1247,
    rating: 4.8,
    growth: 12.5,
  },
  {
    name: "Sushi Zen",
    location: "Los Angeles, CA",
    revenue: 38200,
    orders: 892,
    rating: 4.9,
    growth: 8.3,
  },
  {
    name: "Taco Fiesta",
    location: "Austin, TX",
    revenue: 31800,
    orders: 1089,
    rating: 4.6,
    growth: 15.2,
  },
  {
    name: "Green Garden",
    location: "San Francisco, CA",
    revenue: 28900,
    orders: 756,
    rating: 4.7,
    growth: -2.1,
  },
]

export function AnalyticsDashboard() {
  return (
<div className="space-y-6 py-6">
{/* Time Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Time Period:</span>
          <Select defaultValue="30d">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sales Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="right" dataKey="orders" fill="#10b981" name="Orders" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Revenue ($)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Dishes */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Dishes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularDishesData.map((dish, index) => (
                <div key={dish.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{dish.name}</div>
                      <div className="text-sm text-muted-foreground">{dish.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${dish.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Behavior */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={customerBehaviorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerBehaviorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {customerBehaviorData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busiest Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Busiest Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={busiestHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Restaurants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingRestaurants.map((restaurant, index) => (
              <div key={restaurant.name} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{restaurant.name}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3 w-3" />
                      {restaurant.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="font-bold">${restaurant.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{restaurant.orders}</div>
                    <div className="text-xs text-muted-foreground">Orders</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{restaurant.rating}</span>
                  </div>
                  <Badge
                    variant={restaurant.growth > 0 ? "default" : "destructive"}
                    className={`flex items-center space-x-1 ${
                      restaurant.growth > 0
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    }`}
                  >
                    {restaurant.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{Math.abs(restaurant.growth)}%</span>
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}