"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, CreditCard, Activity, Eye, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react"

const securityAlerts = [
  {
    id: "SEC-001",
    type: "fraud_detection",
    severity: "high",
    title: "Suspicious Payment Pattern Detected",
    description: "Multiple failed payment attempts from same IP address at Bella Italia",
    timestamp: "2024-01-15T10:45:00Z",
    status: "active",
    restaurant: "Bella Italia",
    details: "5 failed attempts in 10 minutes from IP 192.168.1.100",
  },
  {
    id: "SEC-002",
    type: "failed_payment",
    severity: "medium",
    title: "High Volume of Failed Payments",
    description: "Unusual number of payment failures detected across multiple restaurants",
    timestamp: "2024-01-15T09:30:00Z",
    status: "investigating",
    restaurant: null,
    details: "15% increase in failed payments compared to yesterday",
  },
  {
    id: "SEC-003",
    type: "unusual_activity",
    severity: "low",
    title: "Off-Hours Login Activity",
    description: "Restaurant admin logged in outside normal business hours",
    timestamp: "2024-01-15T02:15:00Z",
    status: "resolved",
    restaurant: "Sushi Zen",
    details: "Admin login at 2:15 AM - verified as legitimate",
  },
  {
    id: "SEC-004",
    type: "system_alert",
    severity: "medium",
    title: "API Rate Limit Exceeded",
    description: "Unusual API usage pattern detected from restaurant integration",
    timestamp: "2024-01-15T08:20:00Z",
    status: "active",
    restaurant: "Green Garden",
    details: "1000+ API calls in 1 hour - possible integration issue",
  },
]

const securityMetrics = [
  {
    title: "Fraud Detection Rate",
    value: "99.2%",
    change: "+0.3%",
    trend: "up",
    description: "Successful fraud prevention",
  },
  {
    title: "False Positives",
    value: "2.1%",
    change: "-0.5%",
    trend: "down",
    description: "Legitimate transactions flagged",
  },
  {
    title: "Response Time",
    value: "1.2s",
    change: "-0.3s",
    trend: "down",
    description: "Average alert response time",
  },
  {
    title: "Active Threats",
    value: "3",
    change: "+1",
    trend: "up",
    description: "Currently being monitored",
  },
]

export function SecurityAlerts() {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case "investigating":
        return (
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
            <Eye className="mr-1 h-3 w-3" />
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "fraud_detection":
        return <Shield className="h-5 w-5 text-destructive" />
      case "failed_payment":
        return <CreditCard className="h-5 w-5 text-secondary" />
      case "unusual_activity":
        return <Activity className="h-5 w-5 text-primary" />
      case "system_alert":
        return <AlertTriangle className="h-5 w-5 text-secondary" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {securityMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-primary" />
              ) : (
                <TrendingUp className="h-4 w-4 rotate-180 text-primary" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Badge
                  variant={metric.trend === "up" && metric.title === "Active Threats" ? "destructive" : "default"}
                  className={`${
                    metric.trend === "up" && metric.title !== "Active Threats"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : metric.trend === "down"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : ""
                  }`}
                >
                  {metric.change}
                </Badge>
                <span>{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityAlerts.map((alert) => (
            <Alert key={alert.id} className={alert.severity === "high" ? "border-destructive" : ""}>
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <AlertTitle className="text-base">{alert.title}</AlertTitle>
                    <div className="flex items-center space-x-2">
                      {getSeverityBadge(alert.severity)}
                      {getStatusBadge(alert.status)}
                    </div>
                  </div>
                  <AlertDescription className="text-sm">{alert.description}</AlertDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>ID: {alert.id}</span>
                      {alert.restaurant && <span>Restaurant: {alert.restaurant}</span>}
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {alert.status === "active" && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          Investigate
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{alert.details}</div>
                </div>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Security Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Security Health Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">87/100</span>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Good</Badge>
          </div>
          <Progress value={87} className="h-2" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Strengths</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-3 w-3 text-primary" />
                  High fraud detection rate
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-3 w-3 text-primary" />
                  Fast response times
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-3 w-3 text-primary" />
                  Low false positive rate
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-secondary">Areas for Improvement</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <XCircle className="mr-2 h-3 w-3 text-secondary" />
                  Increase monitoring coverage
                </li>
                <li className="flex items-center">
                  <XCircle className="mr-2 h-3 w-3 text-secondary" />
                  Update security policies
                </li>
                <li className="flex items-center">
                  <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                  Pending security audit
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
