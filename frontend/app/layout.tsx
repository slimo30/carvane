import type { Metadata } from 'next'
import { ABeeZee } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Load ABeeZee
const abeezee = ABeeZee({
  subsets: ['latin'],
  weight: ['400'],        // ABeeZee only has regular
  style: ['normal', 'italic'],
  variable: '--font-abeezee',
})

export const metadata: Metadata = {
  title: 'poli',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Apply ABeeZee font */}
      <body className={`${abeezee.variable} font-sans`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
