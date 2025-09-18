"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Download,
  CreditCard,
  Wallet,
  Banknote,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react"

const transactions = [
  {
    id: "TXN-001",
    orderId: "ORD-2024-001",
    restaurant: "Bella Italia",
    customer: "John Doe",
    amount: 45.99,
    paymentMethod: "card",
    status: "completed",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    cardLast4: "4242",
    fees: 1.38,
  },
  {
    id: "TXN-002",
    orderId: "ORD-2024-002",
    restaurant: "Sushi Zen",
    customer: "Sarah Johnson",
    amount: 78.5,
    paymentMethod: "wallet",
    status: "completed",
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    cardLast4: null,
    fees: 2.36,
  },
  {
    id: "TXN-003",
    orderId: "ORD-2024-003",
    restaurant: "Burger Palace",
    customer: "Mike Wilson",
    amount: 23.75,
    paymentMethod: "cash",
    status: "completed",
    timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
    cardLast4: null,
    fees: 0,
  },
  {
    id: "TXN-004",
    orderId: "ORD-2024-004",
    restaurant: "Green Garden",
    customer: "Emily Davis",
    amount: 67.25,
    paymentMethod: "card",
    status: "failed",
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    cardLast4: "1234",
    fees: 0,
  },
  {
    id: "TXN-005",
    orderId: "ORD-2024-005",
    restaurant: "Taco Fiesta",
    customer: "David Brown",
    amount: 34.99,
    paymentMethod: "card",
    status: "pending",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    cardLast4: "5678",
    fees: 1.05,
  },
  {
    id: "TXN-006",
    orderId: "ORD-2024-006",
    restaurant: "Bella Italia",
    customer: "Lisa Anderson",
    amount: 89.99,
    paymentMethod: "wallet",
    status: "completed",
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    cardLast4: null,
    fees: 2.7,
  },
]

export function TransactionsMonitoring() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [isLive, setIsLive] = useState(true)

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    const matchesPayment = paymentFilter === "all" || transaction.paymentMethod === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "wallet":
        return <Wallet className="h-4 w-4" />
      case "cash":
        return <Banknote className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return timestamp.toLocaleDateString()
  }

  const totalTransactions = transactions.length
  const completedTransactions = transactions.filter((t) => t.status === "completed").length
  const failedTransactions = transactions.filter((t) => t.status === "failed").length
  const totalVolume = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.fees, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {((completedTransactions / totalTransactions) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{failedTransactions}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? "bg-primary hover:bg-primary/90" : ""}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLive ? "animate-spin" : ""}`} />
            {isLive ? "Live" : "Paused"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-mono text-sm">{transaction.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.orderId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {transaction.restaurant.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{transaction.restaurant}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.customer}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">${transaction.amount.toFixed(2)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPaymentIcon(transaction.paymentMethod)}
                      <span className="capitalize">{transaction.paymentMethod}</span>
                      {transaction.cardLast4 && (
                        <span className="text-xs text-muted-foreground">****{transaction.cardLast4}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.fees > 0 ? `$${transaction.fees.toFixed(2)}` : "—"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">{formatTimeAgo(transaction.timestamp)}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
