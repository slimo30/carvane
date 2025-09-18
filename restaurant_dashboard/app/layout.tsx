import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/auth-context"

export const metadata: Metadata = {
  title: "Chef Mode - Formation Culinaire",
  description: "Application de formation culinaire avec guidage vocal et validation",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
