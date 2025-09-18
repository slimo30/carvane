"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, HelpCircle, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"

export function WorkerHeader() {
  const [isOnline, setIsOnline] = useState(true)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="h-6 w-6 text-muted-foreground" />
          <span className="font-medium">{user?.name || "Utilisateur"}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center space-x-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{isOnline ? "En ligne" : "Hors ligne"}</span>
          </Badge>

          <Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4 mr-1" />
            Aide
          </Button>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}
