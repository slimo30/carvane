"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import {
  FileText,
  Download,
  CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  DollarSign,
  Users,
  Store,
} from "lucide-react"

const reportTemplates = [
  {
    id: "daily-sales",
    name: "Daily Sales Report",
    description: "Revenue, orders, and performance metrics for a specific day",
    icon: DollarSign,
    frequency: "Daily",
    lastGenerated: "2024-01-15",
  },
  {
    id: "weekly-summary",
    name: "Weekly Summary",
    description: "Comprehensive weekly performance across all restaurants",
    icon: BarChart3,
    frequency: "Weekly",
    lastGenerated: "2024-01-14",
  },
  {
    id: "monthly-analytics",
    name: "Monthly Analytics",
    description: "Detailed monthly insights and trends analysis",
    icon: FileText,
    frequency: "Monthly",
    lastGenerated: "2024-01-01",
  },
  {
    id: "restaurant-performance",
    name: "Restaurant Performance",
    description: "Individual restaurant metrics and comparisons",
    icon: Store,
    frequency: "On-demand",
    lastGenerated: "2024-01-12",
  },
  {
    id: "customer-insights",
    name: "Customer Insights",
    description: "Customer behavior and satisfaction analysis",
    icon: Users,
    frequency: "Monthly",
    lastGenerated: "2024-01-01",
  },
]

const recentReports = [
  {
    id: "RPT-001",
    name: "Daily Sales Report - Jan 15, 2024",
    type: "daily-sales",
    status: "completed",
    generatedAt: "2024-01-15T09:30:00Z",
    size: "2.4 MB",
  },
  {
    id: "RPT-002",
    name: "Weekly Summary - Week 2, 2024",
    type: "weekly-summary",
    status: "completed",
    generatedAt: "2024-01-14T18:45:00Z",
    size: "5.8 MB",
  },
  {
    id: "RPT-003",
    name: "Restaurant Performance - Bella Italia",
    type: "restaurant-performance",
    status: "processing",
    generatedAt: "2024-01-15T10:15:00Z",
    size: null,
  },
  {
    id: "RPT-004",
    name: "Monthly Analytics - December 2023",
    type: "monthly-analytics",
    status: "failed",
    generatedAt: "2024-01-01T12:00:00Z",
    size: null,
  },
]

export function ReportsSection() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
            <Clock className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template">Report Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a report template" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Restaurants (Optional)</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {["Bella Italia", "Sushi Zen", "Burger Palace", "Green Garden", "Taco Fiesta"].map((restaurant) => (
                <div key={restaurant} className="flex items-center space-x-2">
                  <Checkbox
                    id={restaurant}
                    checked={selectedRestaurants.includes(restaurant)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRestaurants([...selectedRestaurants, restaurant])
                      } else {
                        setSelectedRestaurants(selectedRestaurants.filter((r) => r !== restaurant))
                      }
                    }}
                  />
                  <Label htmlFor={restaurant} className="text-sm">
                    {restaurant}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90" disabled={!selectedTemplate}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <template.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{template.frequency}</span>
                        <span>Last: {template.lastGenerated}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Generated on {new Date(report.generatedAt).toLocaleDateString()} at{" "}
                      {new Date(report.generatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {report.size && <span className="text-sm text-muted-foreground">{report.size}</span>}
                  {getStatusBadge(report.status)}
                  {report.status === "completed" && (
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
