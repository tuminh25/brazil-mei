import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SG Events Hub',
  description: 'Discover events in Singapore',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
